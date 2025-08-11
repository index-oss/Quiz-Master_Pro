// frontend/js/game.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY, BACKEND_URL } from './config.js';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function qs(name){ return new URLSearchParams(location.search).get(name); }
const roomCode = qs('room') || localStorage.getItem('room_code');
document.getElementById('roomCodeText').innerText = roomCode || '—';

const playerArea = document.getElementById('playerArea');
const questionArea = document.getElementById('questionArea');

async function loadPlayers(room_code) {
  const roomRes = await supabase.from('rooms').select('*').eq('room_code', room_code).maybeSingle();
  if (!roomRes.data) return null;
  const roomId = roomRes.data.id;
  const { data } = await supabase.from('room_players').select('*').eq('room_id', roomId);
  playerArea.innerHTML = '<h3>Players</h3>' + data.map(p => `<div>${p.username} — ${p.score}</div>`).join('');
  return roomId;
}

async function subscribeGame(roomId) {
  // players
  supabase.channel('room_' + roomId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` }, payload => {
      loadPlayers(roomCode);
    })
    .subscribe();

  // game state
  supabase.channel('game_' + roomId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state', filter: `room_id=eq.${roomId}` }, payload => {
      renderGameState(payload.new);
    })
    .subscribe();
}

function renderGameState(gs){
  if(!gs) return;
  questionArea.innerHTML = `<h3>Q${gs.question_index+1}: ${gs.question_text}</h3>` +
    `<div class="mt-4">${gs.options.map((o,i)=>`<button class="block w-full text-left p-3 my-2 border rounded" onclick="selectOption(${i})">${o}</button>`).join('')}</div>`;
  window.selectOption = async function(i){
    const playerId = localStorage.getItem('player_id') || null;
    await fetch(BACKEND_URL + '/answer', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ room_id: gs.room_id, user_id: playerId, question_index: gs.question_index, selected_option: i })
    });
    alert('Answer submitted (demo)');
  };
}

(async function init(){
  const roomId = await loadPlayers(roomCode);
  if (roomId) subscribeGame(roomId);
})();
