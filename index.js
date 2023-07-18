/* This is just an example of use of the UNO class
in order for this example to work is necesary to comment in the start method the lines where the deck and the players are randomized (currently lines 121 & 122).

also you can consider this space as a plyaground for testing the class it self whitout modifying the uno.js file*/

const {unoGame} = require("./uno");
const fs = require("fs");

console.log('\x1b[34m Remember if you are executing this example comment lines 121 and 122 in the uno.js file \x1b[0m');

const jugadores = ["jugador 1", "jugador 2", "jugador 3", "jugador 4"];

const uno = new unoGame(jugadores);

uno.start();

const gameExecution = [
  uno.playerPutCard(
    { special: true, color: "comodin", value: "Color Change" },
    "jugador 1",
    "Amarillo"
  ),

  uno.playerPutCard(
    { special: true, color: "Amarillo", value: "¡Salto!" },
    "jugador 2"
  ),
  //No SKIPED x Player message

  uno.playerPutCard(
    { special: true, color: "Amarillo", value: "¡Salto!" },
    "jugador 3"
  ), //invalid

  uno.playerPutCard(
    { special: false, color: "Amarillo", value: 5 },
    "jugador 4"
  ),

  uno.playerPutCard(
    { special: true, color: "comodin", value: "Color Change" },
    "jugador 1",
    "rojo"
  ),

  uno.playerPutCard(
    { special: true, color: "Amarillo", value: "+2" },
    "jugador 2",
    "Azul"
  ), //invalid

  uno.playerPutCard(
    { special: true, color: "Amarillo", value: "+2" },
    "jugador 1"
  ), //invalid

  uno.playerPutCard(
    { special: true, color: "Amarillo", value: "+2" },
    "jugador 1"
  ), //invalid

  uno.playerPutCard(
    { special: true, color: "comodin", value: "+4" },
    "jugador 2",
    "Azul"
  ),
  //No Forced draaws messages //pending 2 forced Draws messages
  uno.playerPutCard(
    { special: true, color: "comodin", value: "+4" },
    "jugador 1",
    "Amarillo"
  ),

  uno.playerPutCard(
    { special: true, color: "Amarillo", value: "+2" },
    "jugador 2"
  ),
  //again pending 1 forced draw message
  uno.playerPutCard(
    { special: true, color: "Amarillo", value: 0 },
    "jugador 4"
  ),

  uno.playerPutCard(
    { special: true, color: "comodin", value: "Color Change" },
    "jugador 1",
    "Amarillo"
  ),

  uno.playerPutCard(
    { special: true, color: "Amarillo", value: "¡Reversa!" },
    "jugador 2"
  ),

  uno.playerPutCard(
    { special: true, color: "comodin", value: "+4" },
    "jugador 1",
    "Azul"
  ),

  uno.playerPutCard(
    { special: true, color: "Azul", value: "¡Salto!" },
    "jugador 3"
  ),

  uno.playerPutCard(
    { special: true, color: "Amarillo", value: "¡Salto!" },
    "jugador 2"
  ), //invalid

  uno.playerPutCard(
    { special: true, color: "comodin", value: "+4" },
    "jugador 1",
    "Azul"
  ),

  uno.playerPutCard({ special: true, color: "Azul", value: "+2" }, "jugador 4"),

  uno.playerPutCard({ special: true, color: "Azul", value: "+2" }, "jugador 3"),

  uno.playerPutCard(
    { special: true, color: "comodin", value: "Color Change" },
    "jugador 1",
    "Rojo"
  ),
];
const onlyMessages = gameExecution
  .flat()
  .filter((command) => command.type == "Server Action")
  .map((command) => command.mesagge);
//console.log(onlyMessages);
fs.writeFileSync("commands.json", JSON.stringify(gameExecution));
fs.writeFileSync("commandsText.json", JSON.stringify(onlyMessages));
