
// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const shortid = require('shortid');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// create a room
app.post('/create-room', async (req, res) => {
  try {
    const { host_id = null, topic = 'General', difficulty = 'Easy' } = req.body;
    const room_code = shortid.generate().slice(0, 6).toUpperCase();
    const { data, error } = await supabaseAdmin
      .from('rooms')
      .insert([{ room_code, host_id, topic, difficulty }])
      .select()
      .single();
    if (error) throw error;
    return res.json({ room: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// join room (creates profile if needed, then room_players)
app.post('/join-room', async (req, res) => {
  try {
    const { room_code, username, avatar_url = null } = req.body;
    if (!room_code || !username) return res.status(400).json({ error: 'room_code and username required' });

    const { data: room, error: rerr } = await supabaseAdmin
      .from('rooms')
      .select('*')
      .eq('room_code', room_code)
      .maybeSingle();
    if (rerr) throw rerr;
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // create profile
    const { data: profile, error: perr } = await supabaseAdmin
      .from('profiles')
      .insert([{ username, avatar_url }])
      .select()
      .single();
    if (perr) throw perr;

    // add to room_players
    const { data: player, error: perr2 } = await supabaseAdmin
      .from('room_players')
      .insert([{ room_id: room.id, user_id: profile.id, username, avatar_url, is_host: false }])
      .select()
      .single();
    if (perr2) throw perr2;

    return res.json({ room, player });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// start game: pick first question and insert into game_state
app.post('/start-game', async (req, res) => {
  try {
    const { room_code } = req.body;
    if (!room_code) return res.status(400).json({ error: 'room_code required' });

    const { data: room } = await supabaseAdmin.from('rooms').select('*').eq('room_code', room_code).maybeSingle();
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // pick one question (simple logic: random)
    const { data: q } = await supabaseAdmin
      .from('questions')
      .select('*')
      .limit(1)
      .order('created_at', { ascending: true })
      .maybeSingle();

    if (!q) return res.status(404).json({ error: 'No questions available' });

    const gs = {
      room_id: room.id,
      question_index: 0,
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option,
      time_left: 20,
      phase: 'show_question'
    };

    const { data, error } = await supabaseAdmin.from('game_state').insert([gs]).select().single();
    if (error) throw error;

    await supabaseAdmin.from('rooms').update({ status: 'in_progress' }).eq('id', room.id);

    return res.json({ game_state: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// submit answer (stores in answers and optionally updates score)
app.post('/answer', async (req, res) => {
  try {
    const { room_id, user_id, question_index, selected_option } = req.body;
    if (!room_id || !user_id) return res.status(400).json({ error: 'room_id and user_id required' });

    // get game_state for current question
    const { data: gs } = await supabaseAdmin
      .from('game_state')
      .select('*')
      .eq('room_id', room_id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let is_correct = null;
    if (gs && gs.correct_option !== null && gs.correct_option !== undefined) {
      is_correct = gs.correct_option === selected_option;
    }

    // insert answer record
    const { data: answer, error: aerr } = await supabaseAdmin
      .from('answers')
      .insert([{ room_id, user_id, question_index, selected_option, is_correct }])
      .select()
      .single();
    if (aerr) throw aerr;

    // optionally update score on correct answer
    if (is_correct) {
      await supabaseAdmin
        .rpc('increment_score', { p_room_id: room_id, p_user_id: user_id, p_inc: 1 })
        .catch(e => console.warn('increment_score error', e.message));
    }

    return res.json({ answer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// explain endpoint (proxy to OpenRouter)
app.post('/explain', async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!OPENROUTER_KEY) return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });

    const payload = {
      model: 'mistral-7b',
      messages: [
        { role: 'system', content: 'You are an educational assistant.' },
        { role: 'user', content: `Explain why the correct answer to: "${question}" is "${answer}". Keep it short and clear.` }
      ],
      max_tokens: 300
    };

    const resp = await fetch('https://api.openrouter.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log('Backend listening on', PORT));
