var musics = [
  { name: "十年", url: "十年.mp3" },
  { name: "K歌之王", url: "K歌之王.mp3" },
  { name: "兄妹", url: "兄妹.mp3" },
  { name: "好就不見", url: "好久不見.mp3" },
  { name: "我們都寂寞", url: "我們都寂寞.mp3" }];
var index = 0;

//like & shuffle button
$('.heart').click(function () {
  $(this).toggleClass('clicked');
});

$('.shuffle').click(function () {
  $(this).toggleClass('clicked');
  
  //隨機
  var i = Math.floor(Math.random()*musics.length);
  playsong(i);
});

//show info box on hover
$('#player').hover(function () {
  $('.info').toggleClass('up');
});

//music player settings

var audio = new Audio();

let timecurrent = $('.time--current');
let timetotal = $('.time--total');
let fill = $('.fill');
let bar = $('.progress-bar');
let fillTotal = bar.width();

$('.pause').hide(); //hide pause button until clicked

//play button
$('.play').click(function () {
  playsong(0);
  $('.play').hide();
  $('.pause').show();
});

//pause button
$('.pause').click(function () {
  audio.pause();
  $('.play').show();
  $('.pause').hide();
});

bar.click(function(event){
 
  let s = audio.duration * (event.offsetX / fillTotal);
  audio.currentTime = s;
})


//一首歌曲撥放完後，自動撥放下一首歌
audio.addEventListener("ended", next, false);

//下一首歌
$(".next").click(next);

function next() {
  index = parseInt(index);
  index += 1;
  if (index >= musics.length) {
    index = 0;
  }
  //撥歌
  playsong(index);
}
//上一首歌
$(".previous").click(function () {
  index = parseInt(index);
  index -= 1;
  if (index <= 0) {
    index = 0;
  }
  //撥歌
  playsong(index);
});

function playsong(i) {
  index = i;

  //從musics的JSON物件中讀取要撥放的音樂
  var playingFile = musics[i];
  //將其音樂檔案的位置設定給audio物件
  audio.setAttribute('src', "../musics/" + playingFile.url);
  //撥放
  audio.play();
  //將撥放的音樂名稱顯示在id為playSong的span標籤中
  $('.song-name').text(playingFile.name);
}

audio.addEventListener("timeupdate", function () {
  timecurrent.text(formatTime(audio.currentTime))
  timetotal.text(formatTime(audio.duration));
  let w = (audio.currentTime / audio.duration) * fillTotal;

  fill.css('width', w + 'px');
}, false);


//格式化時間 mm:ss
function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : "0" + minutes;
  var seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  return minutes + ":" + seconds;
}