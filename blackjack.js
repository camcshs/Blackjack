"use strict";

var SUITS = ['C', 'S', 'H', 'D'];
var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
var VALUES = {
    'A': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'J': 10,
    'Q': 10,
    'K': 10
};
var CARD_IMAGES = "http://storage.googleapis.com/codeskulptor-assets/cards_jfitz.png";
var CARD_BACK = "http://storage.googleapis.com/codeskulptor-assets/card_jfitz_back.png";
var CARD_SIZE = [-72, -96];

var in_play = false;
var outcome = "";
var score = 10;
var player_hand, dealer_hand, house_deck;




function Card(suit, rank) {
    // Initialization
    if ((SUITS.indexOf(suit) !== -1) && (RANKS.indexOf(rank) !== -1)) {
        this.suit = suit;
        this.rank = rank;
    } else {
        this.suit = null;
        this.rank = null;
        console.log("Invalid card: ", suit, rank);
    }

    this.get_suit = function () {
        return this.suit;
    };

    this.get_rank = function () {
        return this.rank;
    };

    Card.prototype.toString = function () {
        return this.suit + this.rank
    };

    this.draw = function (player) {
      var rankValue = CARD_SIZE[0] * RANKS.indexOf(this.rank);
      var suitValue = CARD_SIZE[1] * SUITS.indexOf(this.suit);
        var cardHTML = document.createElement('div');
        cardHTML.className = "card";
       cardHTML.innerHTML = '<img src="' + CARD_IMAGES + '"  style="position: absolute; top:' + suitValue + 'px; left:' + rankValue +'px;" />';
      //  console.log(document.getElementById(player));
      document.getElementById(player).appendChild(cardHTML);
    }

}



function Hand(player) {

    this.cards = [];

    this.player = player;

    this.add_card = function (card) {
        this.cards.push(card);
    };

    this.get_value = function () {
       var hand_count = 0;
       var ace_count = 0;

        this.cards.forEach(function (card) {
            hand_count += VALUES[card.get_rank()];

            if (card.get_rank() === "A") {
                ace_count += 1;
            }
        });

        for (var i = 1; i <= ace_count; i++) {
            if (hand_count <= 11) {
                hand_count += 10;
            }
        }

        return hand_count;
    };

    Hand.prototype.toString = function () {
        var card_list = "";
        this.cards.forEach(function (card) {
            card_list += card.toString() + " ";
        });

        return card_list;

    };


    this.draw = function () {

        this.cards.forEach(function(card) {
             card.draw(player);
        })

    }



}



function Deck() {

    this.deck = [];

    for (var s = 0; s < SUITS.length; s++) {
        for ( var r = 0; r < RANKS.length; r++) {
            this.deck.push(new Card(SUITS[s], RANKS[r]));
        }
    }

    this.shuffle = function () {
        this.deck = shuffle(this.deck);
    };

    this.deal_card = function () {
        return this.deck.pop();
    }
}

function deal() {

    // Create the House Deck and shuffle
    house_deck = new Deck();
    house_deck.shuffle();


    // Create Player and Dealer Hands
    player_hand = new Hand("player");
    dealer_hand = new Hand("dealer");

    // Deal two cards to Player and Dealer
    for (var i = 1; i < 3; i++) {
        player_hand.add_card(house_deck.deal_card());
        dealer_hand.add_card(house_deck.deal_card());
    }

    if (in_play) {
        outcome = "Player chose new deal!";
        score -= 1;
    } else {
        in_play = true;
        outcome = "";
    }

    draw();

}

function hit() {
    // if the hand is in play, hit the player
    if (in_play) {
        player_hand.add_card(house_deck.deal_card());
        outcome = "";
        if (player_hand.get_value() <= 21) {
            console.log(player_hand.get_value());

        } else {

            // if busted, assign a message to outcome, update in_play and score
            console.log("Busted");
            outcome = "Player busted! House Wins!";
            score -= 1;
            in_play = false;
        }
    }
    draw();

}



function stand() {


    // if hand is in play, repeatedly hit dealer until his hand has value 17 or more
    if (in_play) {
        while (dealer_hand.get_value() <= 17) {
            dealer_hand.add_card(house_deck.deal_card())
        }
        // assign a message to outcome, update in_play and score
        if (dealer_hand.get_value() > 21) {
            outcome = "House busted! Player wins!";
            score += 1;
            in_play = false;
        } else if (dealer_hand.get_value() > player_hand.get_value()) {
            outcome = "House wins!";
            score -= 1;
            in_play = false;
        } else if (dealer_hand.get_value() === player_hand.get_value()) {
            outcome = "Tie! House Wins!";
            score -= 1;
            in_play = false;
        } else {
            outcome = "Player wins!";
            score += 1;
            in_play = false;
        }
    }

    draw();

}



function shuffle(array) {
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

document.addEventListener('DOMContentLoaded', function () {
    deal();

}, false);

document.getElementById("deal").addEventListener("click", deal, false);
document.getElementById("hit").addEventListener("click", hit, false);
document.getElementById("stand").addEventListener("click", stand, false);


function draw() {
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("outcome").innerText = outcome;
    document.getElementById("dealer").innerHTML = '';
    document.getElementById("player").innerHTML = '';

    dealer_hand.draw();
    player_hand.draw();

    if (in_play) {


        document.getElementById("dealer").firstChild.innerHTML = '<img src="' + CARD_BACK + '"/>';

    }

    if (in_play) {
        document.getElementById("playMessage").innerText = "Hit or Stand?";
    } else {
        document.getElementById("playMessage").innerText = "New Deal?";
    }



}



