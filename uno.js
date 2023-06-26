function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const COMODIN = "comodin";

class unoGame {
  constructor(players, startingCards = 7) {
    this.startingCards = startingCards;
    this.players = players;
    this.deck = [];
    this.trash = [];
    this.currentColor = COMODIN;
    this.currentValue = "0";
    this.currentSum = 0;
    this.turn = 0;
    this.direction = "+";
    this.playersCards = {};
  }

  start() {
    this.fillDeck();
    //this.deck = shuffle(this.deck);
    //this.players = shuffle(this.players);
    this.dealCards();
  }

  dealCards() {
    for (const player of this.players) {
      this.playersCards[player] = this.drawMultipleCards(this.startingCards);
    }
  }

  isPlayerWin(player) {
    if (this.playersCards[player].length === 0) return true;
    else return false;
  }

  isPlayerUno(player) {
    if (this.playersCards[player].length === 1) return true;
    else return false;
  }

   skipTurn() {
    if ((this.direction == "+")) {
      if (this.turn == this.players.length - 1) this.turn = 0;
      else this.turn++;
    } else {
      if (this.turn == 0) this.turn = this.players.length - 1;
      else this.turn--;
    }
   }

  reverseDirection() {
    if (this.direction == "+") this.direction = "-";
    else this.direction = "+";
  }

  fillDeck() {
    //Adding basic cards
    const Colors = ["Rojo", "Verde", "Azul", "Amarillo"];
    for (let index = 0; index < 4; index++) {
      const actualColor = Colors[index];
      for (let index = 0; index < 10; index++) {
        const newCard = { special: false, color: actualColor, value: index };
        this.deck.push(newCard);
        this.deck.push(newCard);
      }
      //Adding special colored cards
      const specialSimbols = ["+2", "¡Reversa!", "¡Salto!"];
      for (const simbol of specialSimbols) {
        const newCard = { special: true, color: actualColor, value: simbol };
        this.deck.push(newCard);
        this.deck.push(newCard);
      }
    }
    //Adding plus 4s
    const plusFourCards = { special: true, color: COMODIN, value: "+4" };
    this.deck.push(plusFourCards);
    this.deck.push(plusFourCards);
    this.deck.push(plusFourCards);
    this.deck.push(plusFourCards);
    //Adding color change cards
    const colorChangeCard = {
      special: true,
      color: COMODIN,
      value: "Color Change",
    };
    this.deck.push(colorChangeCard);
    this.deck.push(colorChangeCard);
    this.deck.push(colorChangeCard);
    this.deck.push(colorChangeCard);
  }

  getPlayerTurn() {
    return this.players[this.turn];
  }

  getPlayerCards(player) {
    return this.playersCards[player];
  }

  shuffleCards() {
    this.deck = shuffle(this.trash);
    this.trash = [];
  }

  playerDrawCard(player) {
    if (!this.isPlayerTurn(player)) return "NOT Player turn";
    const drawedCard = this.drawCard()
    if (drawedCard !== false) this.playersCards[player].push(drawedCard);
    else {
      this.endTurn();
      return `No cards to draw`;
    }
    this.endTurn();
    return `Jugador ${player} Tomo una carta`;
  }

  playerDrawMultilpleCards(player, amount) {
    const drawedCards = this.drawMultipleCards(amount);
    this.playersCards[player] = this.playersCards[player].concat(drawedCards);
    this.currentSum = 0;
    if (drawedCards.length < amount) {
      this.endTurn();
      return `Jugador ${player} tomo ${drawedCards.length} cartas. no hay mas cartas para tomar`;
    }
    this.endTurn();
    return `jugador ${player} tomo ${drawedCards.length} cartas.`;
  }

  drawCard() {
    if (this.deck.length === 0 && this.trash.length === 0) return false;
    if (this.deck.length === 0) this.shuffleCards();
    const card = this.deck.pop();
    return card;
  }

  drawMultipleCards(amount) {
    const drawCardsArray = [];
    for (let index = 0; index < amount; index++) {
      if (this.deck.length === 0 && this.trash.length === 0)
        return drawCardsArray;
      if (this.deck.length === 0) this.shuffleCards();
      const card = this.deck.pop();
      drawCardsArray.push(card);
    }
    return drawCardsArray;
  }

  playerHasValidCards(player) {
    const playerDeck = this.playersCards[player];
    const validCards = [];
    for (const card of playerDeck) {
      if (this.isValidCard(card)) validCards.push(card);
    }
    if (validCards.length == 0) return false;
    else return validCards;
  }

  isValidCard(card) {
    const { value, color, special } = card;
    if (!special) {
      if (this.currentSum > 0) return false;
      if (color !== this.currentColor && value !== this.currentValue)
        return false;
      else return true;
    } else {
      if (
        color == this.currentColor ||
        value == this.currentValue ||
        color == COMODIN
      ) {
        if (this.currentSum > 0) {
          //valid cards for current sum (future disscucion)
          if (
            card.value[0] == "+" &&
            (card.color == this.currentColor || card.color == COMODIN)
          )
            return true;
          else return false;
        } else return true;
      } else return false;
    }
  }

  isPlayerTurn(player) {
    return this.players[this.turn] == player;
  }

  playerPutCard(player, card) {
    console.log(player, "turn? :", this.isPlayerTurn(player));
    if (!this.isPlayerTurn(player)) return "NOT Player turn";
    if (this.playerHavecard(player, card) === false)
      return "You dont have this card";
    if (!this.isValidCard(card))
      return `Carta invalida, carta actual: ${this.currentColor} ${this.currentValue}`;
    const playerDeck = [...this.playersCards[player]];
    const cardIndexFound = playerDeck.findIndex(
      (playerCard) =>
        playerCard.color == card.color && playerCard.value == card.value
    );
    this.playersCards[player].splice(cardIndexFound, 1);
    return true;
  }

  playerHavecard(player, card) {
    const playerDeck = this.playersCards[player];
    const cardIndexFound = playerDeck.findIndex(
      (playerCard) =>
        playerCard.color == card.color && playerCard.value == card.value
    );
    if (cardIndexFound !== -1) return true;
    else return false;
  }

  putCard(card, player, colorChange) {
    const playerPlaceCard = this.playerPutCard(player, card);
    if (playerPlaceCard !== true) return playerPlaceCard;
    const { value, color, special } = card;
    this.trash.push(card);
    this.currentColor = color;
    this.currentValue = value;
    if (special) {
      if (value === "+4" || value === "Color Change") {
        this.currentColor = colorChange;
      }
      if (value[0] == "+") {
        this.currentSum = this.currentSum + parseInt(value[1]);
      } else if (value == "¡Reversa!") {
        //reverse game direction
        this.reverseDirection();
      } else if (value == "¡Salto!") {
        //Skip player
        this.skipTurn();
      }
    }
    this.endTurn(player);
    return `Jugador ${player} Puso: ${color} ${value}`;
  }

  endTurn(currentPlayer) {
    if (!currentPlayer) {
      currentPlayer = this.players[this.turn];
    }
    
    if (this.isPlayerWin(currentPlayer)) console.log("endTurn 250: ", `Jugador ${currentPlayer} gano`);
    if (this.isPlayerWin(currentPlayer)) return `Jugador ${currentPlayer} gano`;
    this.nextTurn();
    if (this.isPlayerUno(currentPlayer))
    console.log("End Turn 253: ",`Jugador ${currentPlayer} tiene una carta`);
    return `Jugador ${currentPlayer} tiene una carta`;
  }

  nextTurn() {
    if ((this.direction == "+")) {
      if (this.turn == this.players.length - 1) this.turn = 0;
      else this.turn++;
    } else {
      if (this.turn == 0) this.turn = this.players.length - 1;
      else this.turn--;
    }
    this.nextPlayerValidation();
    
  }

  nextPlayerValidation() {
    const nextPlayer = this.players[this.turn];
    const nextPlayerValidCards = this.playerHasValidCards(nextPlayer);
    if (nextPlayerValidCards === false && this.currentSum > 0) {
      this.playerDrawMultilpleCards(nextPlayer, this.currentSum);
      return `Jugador ${nextPlayer} fue forzado a tomar ${this.currentSum} cartas`;
    } else if (nextPlayerValidCards === false && this.currentSum == 0) {
      this.playerDrawCard(nextPlayer);
      return `Jugador ${nextPlayer} fue forzado a tomar una carta`;
    }
  }

}

const jugadores = ["luis", "miguel", "zaniel", "drew"];

const uno = new unoGame(jugadores);

uno.start();

uno.putCard(
  { special: true, color: "comodin", value: "Color Change" },
  "luis",
  "Amarillo"
);

uno.putCard({ special: true, color: "Amarillo", value: "¡Salto!" }, "miguel");

uno.putCard({ special: true, color: "Amarillo", value: "¡Salto!" }, "zaniel"); //invalid

uno.putCard({ special: false, color: "Amarillo", value: 5 }, "drew");

uno.putCard(
  { special: true, color: "comodin", value: "Color Change" },
  "luis",
  "rojo"
);

uno.putCard(
  { special: true, color: "Amarillo", value: "+2" },
  "miguel",
  "Azul"
); //invalid
uno.putCard({ special: true, color: "Amarillo", value: "+2" }, "luis"); //invalid
uno.putCard({ special: true, color: "Amarillo", value: "+2" }, "luis"); //invalid

uno.putCard({ special: true, color: COMODIN, value: "+4" }, "miguel", "Azul");
//so far so good
uno.putCard({ special: true, color: COMODIN, value: "+4" }, "luis", "Amarillo");
uno.putCard({ special: true, color: "Amarillo", value: "+2" }, "miguel");

uno.putCard({ special: true, color: "Amarillo", value: 0 }, "drew");

uno.putCard({ special: true, color: COMODIN, value: "Color Change" }, "luis", "Amarillo");

uno.putCard({ special: true, color: "Amarillo", value: "¡Reversa!" }, "miguel");

uno.putCard({ special: true, color: COMODIN, value: "+4" }, "luis", "Azul");

uno.putCard({ special: true, color: "Azul", value: "¡Salto!" }, "zaniel");

uno.putCard({ special: true, color: "Amarillo", value: "¡Salto!" }, "miguel");//invalid

uno.putCard({ special: true, color: COMODIN, value: "+4" }, "luis", "Azul");

uno.putCard({ special: true, color: "Azul", value: "+2" }, "drew");

uno.putCard({ special: true, color: "Azul", value: "+2" }, "zaniel");

uno.putCard({ special: true, color: COMODIN, value: "Color Change" }, "luis");
/* try {
  const deck = JSON.stringify(this.deck);
  fs.writeFileSync("deck.json", deck);
  console.log("finish");
} catch (error) {
  console.log(error);
} */
