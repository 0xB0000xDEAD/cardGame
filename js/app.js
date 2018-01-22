/*
 * Create a list that holds all of your cards
 */
let glyph = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
// console.log("initial glyph is: \n" + printList(glyph));
/* utilities */
const deck = document.getElementsByClassName('card');
// console.log(deck);
function printList(iterable) {
  let blob = "";
  for (symbol of iterable) {
    blob += "   " + symbol + "\n";
    // console.log(symbol+"\n");
  }
  return blob;
}
const revealButton = document.querySelector('.reveal');
// console.log(revealButton);
const restartButton = document.querySelector('.restart');
// console.log(restartButton);
const hideButton = document.querySelector('.hide');
// console.log(hideButton);
revealButton.addEventListener('click', function() {
  console.log('The reveal button was clicked!');
  reveal();
  // console.log(deck);
});
restartButton.addEventListener('click', function() {
  restart();
  // console.log("The Game was restarted...");
});
hideButton.addEventListener('click', function() {
  hideAll();
  // console.log("Tutto Coperto");
});

function reveal() {
  for (card of deck) {
    card.className = ("card match");
  }
}

function revealMod(requiredArg, optionalArg) {
  optionalArg = optionalArg || 'defaultValue';
  //do stuff
}

function restart() {
  document.location.reload(true);
}

function hideAll() {
  for (card of deck) {
    card.className = "card";
  }
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// TODO: si riferisce a usare un fragment?
//test
// document.addEventListener('DOMContentLoaded', function() {
//    document.querySelector('.stars').style.backgroundColor = 'magenta';
// });
//glyph = shuffle(glyph);
init();
// randomizeDeck(glyph);
function randomizeDeck(glyph) {
  glyph = shuffle(glyph);
  // console.log("randomized glyph is: \n" + printList(glyph));
  let template = "";
  let index = 0;
  for (card of deck) {
    // console.log(index);
    template = "<i class=\"fa " + glyph[index] + "\"></i>";
    // console.log(template); // ok till here
    card.innerHTML = template;
    // console.log(card.innerHTML);
    index++;
  }
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let stillToFind = glyph.slice(7);
let toValidate = ["", ""]
let moves = 0;
let cardsToFind = deck.length / 2;
let time = 0;

function init() {
  hideAll();
  randomizeDeck(glyph);
}
let last = "";
let deadtime = false;

function myListener(target) {
  //  console.log(target.srcElement == last);
  if (target.srcElement == last || deadtime) {
    console.log("disabled");
  } else {
    revealCard(target.srcElement);
    addToQueue(target.srcElement);
    last = target.target.firstElementChild;
  }
}
for (card of deck) {
  let currentCard = card;
  card.addEventListener('click', myListener);
}

function revealCard(target) {
  // console.log("il target è: \n");
  // console.log(target);
  target.setAttribute("class", "card open show ");
}

function hideCards(first, second) {
  first.className = "card";
  second.className = "card";
}
// console.log("initial toValidate is: " + toValidate);
function addToQueue(target) {
  toValidate.splice(2, 0, target);
  toValidate.shift();
  // console.log(toValidate);
  if (toValidate[0] === "") {
    console.log("take a second card please");
  } else {
    // console.log("go to validate");
    validate(toValidate[0], toValidate[1]);
  }
  addMove();
}

function addMove() {
  moves++;
  if (moves == 2) timerId = watchdog();
  document.querySelector('.moves').textContent = moves;
  // getElementsByClassName return an array !!!
  // document.getElementsByClassName('moves')[0].textContent = 89;
}

function validate(first, second) {
  // console.log("argument are: \n");
  // console.log(first);
  // console.log(second);
  console.log(first.firstElementChild.getAttribute("class"));
  console.log(second.firstElementChild.getAttribute("class"));
  switch (first.firstElementChild.getAttribute("class") === second.firstElementChild.getAttribute("class")) {
    case false:
      console.log("nayy");
      // animation placeholder
      setTimeout(hideCards, 750, first, second);
      deadtime = true;
      setTimeout(() => {
        deadtime = false
      }, 750);
      emptyQueue();
      break;
    case true:
      console.log("hayy");
      match(first, second);
      emptyQueue();
      cardsToFind--;
      console.log(cardsToFind);
      if (cardsToFind == 7) {
        console.log("you win!");
        $('#win').modal();
        console.log(clearInterval(timerId));
      }
    default:
  }
}

function watchdog() {
  return setInterval(function() {
    time++
    document.getElementById("minutes").innerHTML = time / 60 | 0;
    document.getElementById("seconds").innerHTML = time % 60 | 0;
  }, 1000);
}
let go = false;
let timerId;

function emptyQueue() {
  toValidate.fill("");
}
function cheat() {

}
function match(first, second) {
  first.className = "card match";
  second.className = "card match";
  for (card of arguments) {
    card.removeEventListener('click', myListener);
    //animation ???
    console.log("listener removed!");
  }
}
// TODO: implement a boardDimension setting
