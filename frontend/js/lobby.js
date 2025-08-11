// frontend/js/lobby.js
import { supabase } from './supabaseClient.js';
import { BACKEND_URL } from './config.js';

const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');
const createdBox = document.getElementById('createdBox');
const joinedBox = document.getElementById('joinedBox');

createBtn.addEventListener('click', async () => {
  const hostName = document.getElementById('hostName').value.trim() || 'Host';
  const res = await fetch(BACKEND_URL + '/create-room', {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ host_id: null, topic: 'General' })
  });
  const data = await res.json();
  if (data.room) {
    createdBox.classList.remove('hidden');
    createdBox.innerText = 'Room created: ' + data.room.room_code;
    localStorage.setItem('room_code', data.room.room_code);
    window.location.href = '/game.html?room=' + data.room.room_code;
  } else {
    alert('Failed to create room');
  }
});

joinBtn.addEventListener('click', async () => {
  const code = document.getElementById('roomCode').value.trim();
  const name = document.getElementById('joinName').value.trim() || 'Player';
  if (!code) return alert('Enter room code');
  const res = await fetch(BACKEND_URL + '/join-room', {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ room_code: code, username: name, avatar_url: null })
  });
  const data = await res.json();
  if (data.player) {
    joinedBox.classList.remove('hidden');
    joinedBox.innerText = 'Joined as ' + data.player.username;
    localStorage.setItem('room_code', code);
    localStorage.setItem('player_id', data.player.user_id);
    window.location.href = '/game.html?room=' + code;
  } else {
    alert('Failed to join room: ' + (data.error || 'unknown'));
  }
});
