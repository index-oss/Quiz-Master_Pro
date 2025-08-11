// frontend/js/leaderboard.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadLeader() {
  const roomCode = localStorage.getItem('room_code');
  const roomRes = await supabase.from('rooms').select('*').eq('room_code', roomCode).maybeSingle();
  if (!roomRes.data) return;
  const players = await supabase.from('room_players').select('*').eq('room_id', roomRes.data.id).order('score', { ascending: false });
  document.getElementById('leaderList').innerHTML = players.data.map((p,i)=>`<div class="p-2 border-b">${i+1}. ${p.username} — ${p.score}</div>`).join('');
}
loadLeader();
