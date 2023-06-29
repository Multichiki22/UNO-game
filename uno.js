const fs = require("fs");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const COMODIN = "comodin";

const TURN_ERROR = "Not player turn";
const INVALID_CARD = "Invalid card put";
const NOT_PLAYER_CARD = "The player dont have the selected card";
const NOT_ENOUGH_CARDS = "not enough cards in deck";
const NO_CARD_TO_TAKE = "no avalible card in deck";
const PLAYER_PUT_CARD = "player put card";
const PLAYER_FORCED_TO_DRAW = "player forced to draw cards";
const PLAYER_WITHOUT_VALID_CARDS = "player dont have valid card"; //NO use rigth now (let the player take cards)
const PLAYER_WIN = "player win";
const PLAYER_TAKE_CARD = "Player took card";
const PLAYER_UNO = "Player have one card";
const SERVER_ACTION = "Server Action";
const PLAYER_SKIP = "Player used skip card";
const ERROR = "error";

//const PLAYER_WIN = "player dont have valid card"

function messageObjectGenerator(infoObject) {
  const {
    type,
    player,
    card,
    actualPlayer,
    currentColor,
    currentValue,
    drawedCards,
    endTurnAction,
    colorChange,
    extraMessage,
    nextPlayer,
    skipedPlayer,
  } = infoObject;
  const basicObject = { type: "default", mesagge: "default message" };
  switch (type) {
    case TURN_ERROR:
      basicObject.type = ERROR;
      basicObject.mesagge = `Not your turn (${player}). Current turn ${actualPlayer}`;
      break;
    case INVALID_CARD:
      basicObject.type = ERROR;
      basicObject.mesagge = `Carta invalida, carta actual: ${currentColor} ${currentValue}`;
      break;
    case NOT_ENOUGH_CARDS:
      basicObject.type = SERVER_ACTION;
      basicObject.mesagge = `Jugador ${player} tomo ${drawedCards.length} cartas. no hay mas cartas para tomar`;
      break;
    case NO_CARD_TO_TAKE:
      basicObject.type = SERVER_ACTION;
      basicObject.mesagge = `No hay cartas para tomar`;
      break;
    case PLAYER_PUT_CARD:
      basicObject.type = SERVER_ACTION;
      if (colorChange !== undefined) {
        basicObject.mesagge = `Jugador ${player} Puso: ${card.color} ${card.value} y cambio el color a ${colorChange}`;
      } else {
        basicObject.mesagge = `Jugador ${player} Puso: ${card.color} ${card.value}`;
      }
      break;
    case PLAYER_FORCED_TO_DRAW:
      basicObject.type = SERVER_ACTION;
      basicObject.mesagge = `Jugador ${player} Fue forzado a tomar ${drawedCards.length} cartas`;
      break;
    case PLAYER_WITHOUT_VALID_CARDS:
      basicObject.type = SERVER_ACTION;
      basicObject.mesagge = `Jugador ${player} No tiene cartas validas: fue obligado a tomar una carta`;
      break;
    case PLAYER_WIN:
      basicObject.type = SERVER_ACTION;
      basicObject.mesagge = `Jugador ${player} gano`;
      break;
    case PLAYER_TAKE_CARD:
      basicObject.type = SERVER_ACTION;
      basicObject.mesagge = `Jugador ${player} tomo una carta`;
      break;
    case NOT_PLAYER_CARD:
      basicObject.type = ERROR;
      basicObject.mesagge = "You dont have this card";
      break;
    case PLAYER_UNO:
      basicObject.type = SERVER_ACTION;
      basicObject.mesagge = `Jugador ${player} tiene una carta`;
      break;
    case PLAYER_SKIP:
      basicObject.type = SERVER_ACTION;
      basicObject.mesagge = `${player} salto a ${skipedPlayer} siguiente turno ${nextPlayer}`;
      break;
    default:
      break;
  }
  if (Array.isArray(extraMessage)) return [basicObject].concat(extraMessage);
  else return [basicObject];
}

//pending playerTakeHit () //action to decide not to acumulate the sum even if the player actually have valid cards
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

  nextPlayerTurn() {
    if (this.direction == "+") {
      if (this.turn == this.players.length - 1) return this.players[0];
      else return this.players[this.turn + 1];
    } else {
      if (this.turn == 0) return this.players[this.players.length - 1];
      else return this.players[this.turn - 1];
    }
  }

  skipTurn() {
    if (this.direction == "+") {
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
    const actualPlayer = this.players[this.turn];
    if (actualPlayer == player) return true;
    else
      return messageObjectGenerator({ type: TURN_ERROR, player, actualPlayer });
  }

  putCard(player, card) {
    if (this.isPlayerTurn(player) !== true) return this.isPlayerTurn(player);
    if (this.playerHaveCard(player, card) === false)
      return messageObjectGenerator({ type: NOT_PLAYER_CARD });
    if (!this.isValidCard(card))
      return messageObjectGenerator({
        type: INVALID_CARD,
        currentColor: this.currentColor,
        currentValue: this.currentValue,
      });
    const playerDeck = [...this.playersCards[player]];
    const cardIndexFound = playerDeck.findIndex(
      (playerCard) =>
        playerCard.color == card.color && playerCard.value == card.value
    );
    this.playersCards[player].splice(cardIndexFound, 1);
    return true;
  }

  playerHaveCard(player, card) {
    const playerDeck = this.playersCards[player];
    const cardIndexFound = playerDeck.findIndex(
      (playerCard) =>
        playerCard.color == card.color && playerCard.value == card.value
    );
    if (cardIndexFound !== -1) return true;
    else return false;
  }
 
  playerPutCard(card, player, colorChange) {
    const playerPlaceCard = this.putCard(player, card);
    if (playerPlaceCard !== true) return playerPlaceCard;
    const { value, color, special } = card;
    this.trash.push(card);
    this.currentColor = color;
    this.currentValue = value;
    let skipedPlayerAction = [];
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
        const skipedPlayer = this.nextPlayerTurn();
        this.skipTurn();
        skipedPlayerAction = messageObjectGenerator({
          type: PLAYER_SKIP,
          player,
          skipedPlayer,
          nextPlayer: this.nextPlayerTurn(),
        });
      }
    }
    const endTurnAction = this.endTurn(player);
    const effectedActions = skipedPlayerAction.concat(endTurnAction);
    return messageObjectGenerator({
      type: PLAYER_PUT_CARD,
      player,
      colorChange,
      card,
      extraMessage: effectedActions,
    });
  }

  endTurn(player) {
    if (!player) {
      player = this.players[this.turn];
    }
    if (this.isPlayerWin(player))
      return messageObjectGenerator({ type: PLAYER_WIN, player });
    const nextTurnText = this.nextTurn();

    if (this.isPlayerUno(player))
      return messageObjectGenerator({
        type: PLAYER_UNO,
        player,
        extraMessage: nextTurnText,
      });
    else return nextTurnText;
  }

  playerDrawCard(player) {
    if (this.isPlayerTurn(player) !== true) return this.isPlayerTurn(player);
    const drawedCard = this.drawCard();
    if (drawedCard !== false) this.playersCards[player].push(drawedCard);
    else {
      const endTurnAction = this.endTurn();
      return messageObjectGenerator({
        type: NO_CARD_TO_TAKE,
        extraMessage: endTurnAction,
      });
    }
    const endTurnAction = this.endTurn();
    return messageObjectGenerator({
      type: PLAYER_TAKE_CARD,
      player,
      extraMessage: endTurnAction,
    });
  }

  playerDrawMultilpleCards(player, amount) {
    const drawedCards = this.drawMultipleCards(amount);
    this.playersCards[player] = this.playersCards[player].concat(drawedCards);
    this.currentSum = 0;
    if (drawedCards.length < amount) {
      const endTurnAction = this.endTurn();
      return messageObjectGenerator({
        type: NOT_ENOUGH_CARDS,
        player,
        drawedCards,
        extraMessage: endTurnAction,
      });
    }
    const endTurnAction = this.endTurn();
    return messageObjectGenerator({
      type: PLAYER_FORCED_TO_DRAW,
      player,
      drawedCards,
      extraMessage: endTurnAction,
    });
  }

  nextTurn() {
    if (this.direction == "+") {
      if (this.turn == this.players.length - 1) this.turn = 0;
      else this.turn++;
    } else {
      if (this.turn == 0) this.turn = this.players.length - 1;
      else this.turn--;
    }
    return this.nextPlayerValidation();
  }

  nextPlayerValidation() {
    const nextPlayer = this.players[this.turn];
    const nextPlayerValidCards = this.playerHasValidCards(nextPlayer);
    if (nextPlayerValidCards === false && this.currentSum > 0) {
      return this.playerDrawMultilpleCards(nextPlayer, this.currentSum);
    } else if (nextPlayerValidCards === false && this.currentSum == 0) {
      return this.playerDrawCard(nextPlayer);
    } else {
      return false;
    }
  }
}

const jugadores = ["luis", "miguel", "zaniel", "drew"];

const uno = new unoGame(jugadores);

uno.start();

const gameExecution = [
  uno.playerPutCard(
    { special: true, color: "comodin", value: "Color Change" },
    "luis",
    "Amarillo"
  ),

  uno.playerPutCard({ special: true, color: "Amarillo", value: "¡Salto!" }, "miguel"),
  //No SKIPED x Player message

  uno.playerPutCard({ special: true, color: "Amarillo", value: "¡Salto!" }, "zaniel"), //invalid

  uno.playerPutCard({ special: false, color: "Amarillo", value: 5 }, "drew"),

  uno.playerPutCard(
    { special: true, color: "comodin", value: "Color Change" },
    "luis",
    "rojo"
  ),

  uno.playerPutCard(
    { special: true, color: "Amarillo", value: "+2" },
    "miguel",
    "Azul"
  ), //invalid

  uno.playerPutCard({ special: true, color: "Amarillo", value: "+2" }, "luis"), //invalid

  uno.playerPutCard({ special: true, color: "Amarillo", value: "+2" }, "luis"), //invalid

  uno.playerPutCard({ special: true, color: COMODIN, value: "+4" }, "miguel", "Azul"),
  //No Forced draaws messages //pending 2 forced Draws messages
  uno.playerPutCard(
    { special: true, color: COMODIN, value: "+4" },
    "luis",
    "Amarillo"
  ),

  uno.playerPutCard({ special: true, color: "Amarillo", value: "+2" }, "miguel"),
  //again pending 1 forced draw message
  uno.playerPutCard({ special: true, color: "Amarillo", value: 0 }, "drew"),

  uno.playerPutCard(
    { special: true, color: COMODIN, value: "Color Change" },
    "luis",
    "Amarillo"
  ),

  uno.playerPutCard(
    { special: true, color: "Amarillo", value: "¡Reversa!" },
    "miguel"
  ),

  uno.playerPutCard({ special: true, color: COMODIN, value: "+4" }, "luis", "Azul"),

  uno.playerPutCard({ special: true, color: "Azul", value: "¡Salto!" }, "zaniel"),

  uno.playerPutCard({ special: true, color: "Amarillo", value: "¡Salto!" }, "miguel"), //invalid

  uno.playerPutCard({ special: true, color: COMODIN, value: "+4" }, "luis", "Azul"),

  uno.playerPutCard({ special: true, color: "Azul", value: "+2" }, "drew"),

  uno.playerPutCard({ special: true, color: "Azul", value: "+2" }, "zaniel"),

  uno.playerPutCard(
    { special: true, color: COMODIN, value: "Color Change" },
    "luis",
    "Rojo"
  ),
];
const onlyMessages = gameExecution
  .flat()
  .filter((command) => command.type == SERVER_ACTION)
  .map((command) => command.mesagge);
//console.log(onlyMessages);
fs.writeFileSync("commands.json", JSON.stringify(gameExecution));
fs.writeFileSync("commandsText.json", JSON.stringify(onlyMessages));
