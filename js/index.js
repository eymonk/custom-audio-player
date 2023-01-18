const domItems = {
  body: document.querySelector('.body'),
  background: document.querySelector('.background'),
  player: document.querySelector('.player'),

  playlistItems: document.querySelectorAll('.playlist__item'),

  playPauseBtn: document.querySelector('.play-pause'),
  playPauseIcon: document.querySelector('.play-pause__icon'),
  nextBtn: document.querySelector('.next'),
  previousBtn: document.querySelector('.previous'),
  
  rangeDuration: document.querySelector('.player__range-duration'),
  duration: document.querySelector('.player__duration-info'),
  rangeVolume: document.querySelector('.player__range-volume'),
  volumeInfo: document.querySelector('.player__volume-info'),

  songTime: document.querySelector('.player__song-time'),
  songAuthor: document.querySelector('.player__song-author'),
  songName: document.querySelector('.player__song-name'),
  songCover: document.querySelector('.player__song-cover'),
  song: document.querySelector('.player__song'),
}


const state = {
  isOn: false,
  currentDuration: 0,
  currentTimeInterval: 0,
  currentSong: 0,
  updateTime: 1000,
}

const songs = [
  ['Bonobo - Silver', 'Bonobo', 'Silver', true],
  ['Elestre - Labyrinthe', 'Elestre', 'Labyrinthe', true],
  ['Boards of Canada - Music Is Math', 'Boards of Canada', 'Music Is Math', true],
  ['Otto Suits - Goddamn', 'Otto Suits', 'Goddamn', false],
  ['Grey Killer - Cosmic River', 'Grey Killer', 'Cosmic River', true],
];

const colors = ['#ffccd199', '#ff778499',   //red
                '#ffd7ad99', '#ffae5899',   //orange
                '#ffe99199', '#ffdf5e99',   //yellow
                '#b6f9cd99', '#68f29799',   //green
                '#c0f0ff99', '#70f0f999',   //light-blue
                '#c0c0ff99', '#8080ff99',   //blue
                '#f2c4ff99', '#e380ff99',   //purple
                '#ffd5eb99', '#ff80c199'];  //pink

function play() {
  domItems.song.play();
  domItems.playPauseIcon.setAttribute('src', 'assets/svg/pause.svg');
  state.currentTimeInterval = setInterval(changeCurrentTime, state.updateTime);
  domItems.songCover.style.animationPlayState = 'running';
  return state.isOn = true;
}

function pause() {
  domItems.song.pause();
  domItems.playPauseIcon.setAttribute('src', 'assets/svg/play.svg');
  clearInterval(state.currentTimeInterval);
  domItems.songCover.style.animationPlayState = 'paused';
  return state.isOn = false;
}

function changeSong(direction) {
  direction = direction? direction : 'next';

  if(this.classList) direction = this.classList.contains('next') ? 'next' : 'prev';
  if(direction === 'next') {
    state.currentSong = state.currentSong < songs.length - 1 ? ++state.currentSong : 0;
  } else {
    state.currentSong = state.currentSong > 0 ? --state.currentSong : songs.length - 1;
  }

  clearInterval(state.currentTimeInterval);
  setSong(songs[state.currentSong]);
  changeCurrentTime();
  changeBackground();
  return state.isOn ? play() : pause();
}

function setSong(song) {
  const cover = song[3]? `./assets/img/covers/${song[2]}.jpg` : `./assets/img/covers/no-cover.jpg`;
  domItems.songCover.setAttribute('src', cover);
  domItems.song.setAttribute('src', `./assets/audio/${song[0]}.mp3`);
  domItems.songAuthor.textContent = song[1];
  domItems.songName.textContent = song[2];

  domItems.playlistItems.forEach(song => {
    const songNumber = parseInt(song.dataset.songNumber);
    if (songNumber === state.currentSong) song.classList.add('active');
    else song.classList.remove('active');
  })
}

function getMinutes(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time - minutes * 60);
  minutes = `${minutes}:`;
  seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return minutes.concat(seconds);
}

function changeCurrentTime() {
  domItems.rangeDuration.value = domItems.song.currentTime;
  domItems.songTime.textContent = getMinutes(domItems.song.currentTime);
  if (Number(domItems.rangeDuration.value) === state.currentDuration) changeSong();
}

function setDuration() {
  state.currentDuration = Math.trunc(domItems.song.duration);
  domItems.duration.textContent = getMinutes(state.currentDuration);
  domItems.rangeDuration.setAttribute('max', `${Math.floor(domItems.song.duration)}`);
}

function setSongTime() {
  domItems.song.currentTime = domItems.rangeDuration.value;
  domItems.songTime.textContent = getMinutes(domItems.song.currentTime);
}

function setSongVolume() {
  domItems.song.volume = domItems.rangeVolume.value / 100;
  domItems.volumeInfo.textContent = `${domItems.rangeVolume.value}%`;
}

function changeVolume(direction) {
  let value = Number(domItems.rangeVolume.value);
  direction === 'up' ? value += 1 : value -= 1;
  domItems.rangeVolume.value = value;
  setSongVolume();
}

function getRandom(upTo) {
  return Math.floor(Math.random() * upTo);
}

function changeBackground() {
  const color = colors[getRandom(colors.length)];
  domItems.background.style.backgroundColor = color;
  domItems.player.style.borderColor = color;
  domItems.body.style.backgroundImage = `url(./assets/img/backgrounds/${getRandom(5)}.jpg)`;
}


//initial setUp
setSong(songs[0]);

//play or pause
domItems.playPauseBtn.addEventListener('click', () => state.isOn ? pause() : play());

//previous song
domItems.previousBtn.addEventListener('click', changeSong);

//next song
domItems.nextBtn.addEventListener('click', changeSong);

//set song time
domItems.rangeDuration.addEventListener('change', setSongTime);

//set song volume
domItems.rangeVolume.addEventListener('change', setSongVolume);

//load song duration
domItems.song.addEventListener('loadeddata', setDuration)

document.addEventListener('keydown', (event) => {
  document.activeElement.blur();
  const e = event.code.toLowerCase();

  if (e === 'enter' || e === 'space') state.isOn? pause() : play();
  else if (e === 'arrowup') changeVolume('up');
  else if (e === 'arrowdown') changeVolume('down');
  else if (e === 'arrowleft') changeSong('prev');
  else if (e === 'arrowright') changeSong('next');
})

//play song from playlist
domItems.playlistItems.forEach(song => {
  song.addEventListener('click', () => {
    const songNumber = parseInt(song.dataset.songNumber)
    state.currentSong = songNumber;
    setSong(songs[songNumber]);
    play();
  });
});


