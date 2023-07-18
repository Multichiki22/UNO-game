# UNO GAME ENGINE V0.1

<b><i>This is a work in progress game engine for the clasical UNO card game.</b></i>

## The objective of the project

The objective is to create an event-based game engine that can modify the rules of the game to suit the user and that can be used in any type of project, be it a web page, a server, a terminal execution or any other application that can be imagine (using JS)

## Why making a game engine just for UNO

The idea behind this project is based on the fact that each person / group of people plays UNO in a different way with very different rules, many of these rules can make the game more fun, longer, shorter or just more enjoyable, but there is no one set of rules that everyone agrees on. (Personally i think the oficial UNO rules are kind of boring)
Thinking about this situation and personally wanting to implement a UNO game, I looked for someone who has already programmed a UNO with rules close to the ones I personally enjoy and discovered that there are few UNO projects (or at least that I have managed to find) and none managed to satisfy what I wanted. What was I looking for so I got to work

## Current state of the project

Currently the class is functional but it still has several bugs, it lacks many validations and it only has the most basic functionalities (That's why it is version 0.1).

### Current functionalities:

<ul>
<li>Create a new game </li>
<li>Generates the deck of cards and shuffles it </li>
<li>Distribute the cards among the players randomly </li>
<li>Decide the order of the players randomly </li>
<li>Puts an initial card before the players turn </li>
<li>Allows you to take cards </li> 
<li>Allows you to put cards </li> 
<li>Validate if it is the turn of the correct player </li> 
<li>Validate if the card to be played meets the conditions to be played as the coincidence of color and/or number </li>
<li>Validate if there are cards left in the drag deck and shuffle the discard deck in case it runs out </li>
<li>Validate if in extreme cases a player could not take enough cards (due to lack of cards in drag and discard deck) </li>
<li>Validate if the next player has valid cards </li>
<li>Validate if at the end of the turn the player won </li>
<li>Validate if at the end of the turn the player has one card </li>
<li>Executes forced card taking in case of not having valid cards to use </li>
<li>Execute special action plus four: Where the sum of the cards to be picked up increases by four and the player can decide what color to change the card to </li>
<li>Execute special action plus two: Where the sum of the cards to be picked up increases by two, only if the color of the card matches the color in play </li>
<li>Execute special color change action: The color is changed to the color chosen by the user </li>
<li>Execute special action change of direction: The order of play is changed to the opposite direction to the current one </li>
<li>Execute special action player jumps: Skip to the next player regardless of the cards that the player has, only if the color of the card matches the color in play </li>
</ul>

## The future of the project

Here are the thing im trying to achive with this proyect eventually (I dont know how much time is gona take me)

<ol>
<li>Configuration of rules like:</li>
<ul>
    <li>Configuration of minimum and maximum players </li>
    <li>Selection of valid cards for a chain of sums. for example allow reverse after a plus two </li>
    <li>Options for many players. for example a drag deck twice as big </li>
    <li>Activation or deactivation of chains of sums </li>
    <li>Activation or deactivation of automatic execution of the engine (the engine is in charge of executing actions automatically if the player only has one possible action) </li>
    <li>Activation or deactivation of the obligation to take cards (If the player has valid cards to play, he is forced to use them) </li>
    <li>Increase or reduction in the number of special cards. for example only one plus four, or no reverse or ten color changes or all at the same time </li>
</ul>
<br>
<li>Support for multiple languages with the possibility of adding new languages easily</li>
<li>Make it an NPM package to make integartion easier</li>
</ol>


## To end this

This is just a fun side project, I'm <b>not</b> an expert or a god of programming, so it's normal that there are bugs and especially "dirty" code. That being said, I accept criticism and improvements that can be implemented in the project.

If for some unkown reason you reach this repo and like the idea please leave a star i will be very gratefull