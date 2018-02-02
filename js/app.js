/* Global variable */
let last = '';
let deadtime = false;
let go = false;
let timerId;
let toValidate = ['', ''];
let moves = 0;
const stars = document
  .getElementsByClassName('stars')[0]
  .getElementsByClassName('fa');
let time = 0;
let glyph = [
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb',
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb'
];
let stillToFind = glyph.slice(7);
const deck = document.getElementsByClassName('card');
// console.log(deck);
let cardsToFind = deck.length / 2;
/* utility */
function printList(iterable) {
  let blob = '';
  for (symbol of iterable) {
    blob += '   ' + symbol + '\n';
  }
  return blob;
}

function init() {
  $('#win').modal('hide');
  hideAll();
  randomizeDeck(glyph);
  addListener();
  last = '';
  toValidate = ['', ''];
  cardsToFind = deck.length / 2;
  time = 0;
  clearInterval(timerId);
  // time formatting code from  https://stackoverflow.com/questions/8043026/javascript-format-number-to-have-2-digit#8043061
  let seconds = (time % 60) | 0;
  let minutes = (time / 60) | 0;
  let fSeconds = ('0' + seconds).slice(-2);
  let fMinutes = ('0' + minutes).slice(-2);
  document.getElementById('minutes').innerHTML = fMinutes;
  document.getElementById('seconds').innerHTML = fSeconds;
  trackProgress(moves);
}
const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', function() {
  restart();
});

function restart() {
  init();
}

function hideAll() {
  for (card of deck) {
    card.className = 'card';
  }
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function randomizeDeck(glyph) {
  glyph = shuffle(glyph);
  // console.log("randomized glyph is: \n" + printList(glyph));
  let template = '';
  let index = 0;
  for (card of deck) {
    template = '<i class="fa ' + glyph[index] + '"></i>';
    card.innerHTML = template;
    index++;
  }
}
init();

function myListener(event) {
  let clicked = event.target;
  // take the right Element
  if (event.target.nodeName === 'I') {
    // console.log('you clicked a <i>');
    clicked = event.target.parentElement;
  }
  //last and deadtime prevent respectively to click on the same card or on a third before the cards are hidden
  if (clicked.firstElementChild === last || deadtime) {
    console.log('not allowed');
  } else {
    revealCard(clicked);
    addToQueue(clicked);
    last = clicked.firstElementChild;
  }
}

function addListener() {
  for (card of deck) {
    card.addEventListener('click', myListener);
  }
}

function revealCard(target) {
  target.className = 'card open show';
}

function hideCards(first, second) {
  first.className = 'card';
  second.className = 'card';
}

function addToQueue(target) {
  //toValidate store the last 2 cards. Every time addToQueue is called the new card is pushed into the array
  toValidate.splice(2, 0, target);
  toValidate.shift();
  if (toValidate[0] === '') {
    console.log('take a second card please');
  } else {
    // Every card "added to the queue" increment the moves via trackProgress
    trackProgress();
    validate(toValidate[0], toValidate[1]);
  }
}

function emptyQueue() {
  toValidate.fill('');
}

function trackProgress() {
  if (arguments.length == 0) {
    moves++;
    //when the first 2 cards are revealed the timer starts
    if (moves == 2) timerId = timer();
    //update moves
    document.querySelector('.moves').textContent = moves + ' moves';
    //star threshold
    switch (moves) {
      case 12:
        stars[2].style.visibility = 'hidden';
        break;
      case 24:
        stars[1].style.visibility = 'hidden';
        break;
      default:
    }
  } else {
    moves = 0;
    document.querySelector('.moves').textContent = moves + ' moves';
    resetStars();
  }
}

function resetStars() {
  for (star of stars) {
    star.style.visibility = 'visible';
  }
}

function validate(first, second) {
  //check if the cards are the same
  switch (first.firstElementChild.getAttribute('class') ===
    second.firstElementChild.getAttribute('class')) {
    case false:
      console.log('nayy');
      // hide the cards that do not match with a little delay
      setTimeout(hideCards, 500, first, second);
      // inhibit to add new card to the queue for the same time the card are revelead
      deadtime = true;
      setTimeout(() => {
        deadtime = false;
      }, 500);
      emptyQueue();
      break;
    case true:
      console.log('hayy');
      match(first, second);
      emptyQueue();
      cardsToFind--;
      if (cardsToFind == 0) {
        win();
      }
    default:
  }
}

function match(first, second) {
  first.className = 'card match';
  second.className = 'card match';
  //remove the event listener from the matched pair
  for (card of arguments) {
    card.removeEventListener('click', myListener);
  }
}

function win() {
  //call the end game modal
  $('#win').modal();
  document.getElementsByClassName(
    'time'
  )[0].textContent = `You completed the game in ${
    document.getElementById('minutes').innerHTML
  }:${document.getElementById('seconds').innerHTML}`;
  document.getElementsByClassName(
    'stars'
  )[1].innerHTML = document.getElementsByClassName('stars')[0].innerHTML;
  clearInterval(timerId);
}

function timer() {
  return setInterval(function() {
    time++;
    let seconds = (time % 60) | 0;
    let minutes = (time / 60) | 0;
    let fSeconds = ('0' + seconds).slice(-2);
    let fMinutes = ('0' + minutes).slice(-2);
    document.getElementById('minutes').innerHTML = fMinutes;
    document.getElementById('seconds').innerHTML = fSeconds;
  }, 1000);
}
