//#region
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
//#endregion

import { print } from './lib/output.mjs';
import { ANSI } from './lib/ansi.mjs';
import { getRandomItemFromArray } from './lib/random.mjs';

async function showStartScreen() {
    print(ANSI.CLEAR_SCREEN);
    print("Welcome to Rock Paper Scissors!", ANSI.COLOR.GREEN);
    print("Press Enter to start...", ANSI.COLOR.WHITE);
    await rl.question('');
}

async function main() {
    let languageChoice = await rl.question("Choose Language: 1. English, 2. Norwegian: ");
    let gameDictionary;

    if (languageChoice === "1") {
        gameDictionary = (await import('./dictionary_en.mjs')).default;
    } else if (languageChoice === "2") {
        gameDictionary = (await import('./dictionary.mjs')).default;
    } else {
        console.error("Invalid language choice. Defaulting to Norwegian.");
        gameDictionary = (await import('./dictionary.mjs')).default;
    }

    const CHOICES = { rock: 1, paper: 2, scissors: 3 };
    const LIST_OF_CHOICES = [CHOICES.rock, CHOICES.paper, CHOICES.scissors];

    let playAgain = true;
    while (playAgain) {
        await showStartScreen();
        let playerChoice = await askForPlayerChoice(gameDictionary);
        let aiChoice = makeAIChoice();

        print(`${gameDictionary.youPicked} ${getDesc(playerChoice, gameDictionary)} ${gameDictionary.aiPicked} ${getDesc(aiChoice, gameDictionary)}`);
        print(gameDictionary.winner + evaluateWinner(playerChoice, aiChoice));

        let answer = await rl.question("Play again? (y/n): ");
        playAgain = answer.toLowerCase() === 'y';
    }
    rl.close();
}

function evaluateWinner(p1Ch, p2Ch) {
    // Vi går ut i fra at spiller 2 vinner :)
    let result = gameDictionary.player2;

    // Men vi må sjekke om noe annet skjedde.
    if (p1Ch == p2Ch) {
        result = gameDictionary.draw;
    } else if (p1Ch == CHOICES.rock) {
        if (p2Ch == CHOICES.scissors) {
            result = gameDictionary.player1;
        }
    } else if (p1Ch == CHOICES.paper) {
        if (p2Ch == CHOICES.rock) {
            result = gameDictionary.player1;
        }
    } else if (p1Ch == CHOICES.scissors) {
        if (p2Ch == CHOICES.paper) {
            result = gameDictionary.player1;
        }
    }

    return result;
}

function makeAIChoice() {
    return getRandomItemFromArray(LIST_OF_CHOICES);
}

function getDesc(choice, gameDictionary) {
    return gameDictionary.choices[choice - 1];
}

async function askForPlayerChoice(gameDictionary) {

    let choice = null;

    do {
        print(gameDictionary.selectionQuestion);
        let rawChoice = await rl.question("");
        rawChoice = rawChoice.toUpperCase();
        choice = evaluatePlayerChoice(rawChoice, gameDictionary); 
    } while (choice == null);

    return choice;
}

function evaluatePlayerChoice(rawChoice, gameDictionary) {
    let choice = null;
    rawChoice = rawChoice.toLowerCase(); 

    if (rawChoice === gameDictionary.rock.toLowerCase() || rawChoice === 'r') {
        choice = CHOICES.rock;
    } else if (rawChoice === gameDictionary.paper.toLowerCase() || rawChoice === 'p') {
        choice = CHOICES.paper;
    } else if (rawChoice === gameDictionary.scissors.toLowerCase() || rawChoice === 's') {
        choice = CHOICES.scissors;
    }
    return choice;
}

main();
