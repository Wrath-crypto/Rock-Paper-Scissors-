//#region
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
//#endregion

import { print } from './lib/output.mjs';
import { ANSI } from './lib/ansi.mjs';
import { getRandomItemFromArray } from './lib/random.mjs';

// Fancy screen shows up
async function showSplashScreen() {
    print(ANSI.CLEAR_SCREEN);
    print("ROCK PAPER SCISSORS", ANSI.COLOR.YELLOW);
    print("       (and Spock & Lizard!)", ANSI.COLOR.BLUE);
    await delay(2000); // Wait time for dramatic effect
}

// Function to display the fancy start screen
async function showDetailedStartScreen(gameDictionary) {
    print(ANSI.CLEAR_SCREEN);
    print("Welcome to Rock Paper Scissors (Spock & Lizard)!", ANSI.COLOR.GREEN);
    print("1. Single Player", ANSI.COLOR.WHITE);
    print("2. Two-Player (Hot-Seat)", ANSI.COLOR.WHITE);
    print("3. Change Language", ANSI.COLOR.WHITE);
    print("4. Exit", ANSI.COLOR.WHITE);
    let choice = await rl.question("Enter your choice: ");
    return choice;
}

// Function to handle the main game loop
async function mainGameLoop(gameDictionary, numPlayers) {
    let playAgain = true;
    while (playAgain) {
        let player1Choice, player2Choice;
        player1Choice = await askForPlayerChoice(gameDictionary, 1);
        if (numPlayers === 2) {
            player2Choice = await askForPlayerChoice(gameDictionary, 2);
        } else {
            player2Choice = makeAIChoice();
        }
        print(showResult(player1Choice, player2Choice, gameDictionary, numPlayers));
        playAgain = await getPlayAgainConfirmation(gameDictionary);
    }
}

//Second function to display the result the game
function showResult(player1Choice, player2Choice, gameDictionary, numPlayers){
    let result = evaluateWinner(player1Choice, player2Choice, gameDictionary);
    let output = "";
    if(numPlayers === 1){
        output = `${gameDictionary.player1Picked} ${getDesc(player1Choice, gameDictionary)} \n ${gameDictionary.player2Picked} ${getDesc(player2Choice, gameDictionary)} \n ${gameDictionary.winner} ${result}`
    } else {
        output = `${gameDictionary.player1Picked} ${getDesc(player1Choice, gameDictionary)} \n ${gameDictionary.player2Picked} ${getDesc(player2Choice, gameDictionary)} \n ${gameDictionary.winner} ${result}`
    }
    return output;
}


// Function to handle two-player mode
async function handleTwoPlayerMode(gameDictionary) {
    await mainGameLoop(gameDictionary, 2);
}


// Function to get player's choice
async function askForPlayerChoice(gameDictionary, playerNum) {
    let choice = null;
    do {
        print(`${gameDictionary.player}${playerNum}${gameDictionary.selectionQuestion}`);
        let rawChoice = await rl.question("");
        rawChoice = rawChoice.toLowerCase();
        choice = evaluatePlayerChoice(rawChoice, gameDictionary);
    } while (choice == null);
    return choice;
}

// Function to get the AI choice
function makeAIChoice() {
    return getRandomItemFromArray(LIST_OF_CHOICES);
}

// Function to determine who's the winner
const WIN_CONDITIONS = {
    rock: ["scissors", "lizard"],
    paper: ["rock", "spock"],
    scissors: ["paper", "lizard"],
    spock: ["scissors", "rock"],
    lizard: ["spock", "paper"]
};

function evaluateWinner(p1Ch, p2Ch, gameDictionary) {
    let p1Choice = Object.keys(CHOICES).find(key => CHOICES[key] === p1Ch);
    let p2Choice = Object.keys(CHOICES).find(key => CHOICES[key] === p2Ch);
    if (p1Choice === p2Choice) return gameDictionary.draw;
    if (WIN_CONDITIONS[p1Choice].includes(p2Choice)) return gameDictionary.player1;
    return gameDictionary.player2;
}

// Function to get description of choice
function getDesc(choice, gameDictionary) {
    return gameDictionary.choices[choice - 1];
}

// Function to ask if the player want to play again
async function getPlayAgainConfirmation(gameDictionary) {
    let answer = await rl.question(`${gameDictionary.playAgain}: `);
    return answer.toLowerCase() === 'y';
}

// Function to evaluate player choice
function evaluatePlayerChoice(rawChoice, gameDictionary) {
    let choice = null;
    rawChoice = rawChoice.toLowerCase();
    if (rawChoice === gameDictionary.rock.toLowerCase() || rawChoice === 'r') {
        choice = CHOICES.rock;
    } else if (rawChoice === gameDictionary.paper.toLowerCase() || rawChoice === 'p') {
        choice = CHOICES.paper;
    } else if (rawChoice === gameDictionary.scissors.toLowerCase() || rawChoice === 's') {
        choice = CHOICES.scissors;
    } else if (rawChoice === gameDictionary.spock.toLowerCase() || rawChoice === 'k') {
        choice = CHOICES.spock;
    } else if (rawChoice === gameDictionary.lizard.toLowerCase() || rawChoice === 'l') {
        choice = CHOICES.lizard;
    }
    return choice;
}

//Delay Function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const CHOICES = { rock: 1, paper: 2, scissors: 3, spock: 4, lizard: 5 };
const LIST_OF_CHOICES = [CHOICES.rock, CHOICES.paper, CHOICES.scissors, CHOICES.spock, CHOICES.lizard];

async function main() {
    await showSplashScreen();
    let gameDictionary;
    do {
        let choice = await showDetailedStartScreen((await import('./dictionary.mjs')).default); //Defaults to Norwegian
        switch (choice) {
            case "1":
                gameDictionary = (await import('./dictionary.mjs')).default; //Defaults to Norwegian
                await mainGameLoop(gameDictionary, 1);
                break;
            case "2":
                gameDictionary = (await import('./dictionary.mjs')).default; //Defaults to Norwegian
                await handleTwoPlayerMode(gameDictionary);
                break;
            case "3":
                let languageChoice = await rl.question("Choose Language: 1. English, 2. Norwegian: ");
                if (languageChoice === "1") {
                    gameDictionary = (await import('./dictionary_en.mjs')).default;
                } else {
                    gameDictionary = (await import('./dictionary.mjs')).default;
                }
                break;
            case "4":
                print("Exiting game...");
                break;
            default:
                print("Invalid choice.");
        }
    } while (choice !== "4");
    rl.close();
}

main();            