# Rock Papers Scissors Coding:

Refactoring decisions:
There were many, so I'll list the ones off of the top of my head that I can consciously remember doing.
I broke the code down into more manageable and readable parts so that it would be easier to know which code does what.
I changed some variable names to give it a clear and descriptive variable name. For example, I changed choice to playerChoice to make it more obvious what choice was made, and GAME_DICTIONARY to gameDictionary for OCD reasons.
I could definitely improve the error handling in the code as I don't have one for when
I added a line of code so that you only need to press R, P or S to choose rock, paper, or scissors, since it's much more practical and easier for the player.

Improvements:
Currently, the code doesn't accept anything that isn't rock, paper, or scissor (When in game) and it might behave in an unexpected manner if any other word or command were input.
To include Spock and Lizard, I would have to improve and expand on the evaluateWinner functions. I could redesign it to be more flexible in it's selection of winners and additional choices.
The code is a bit unorganized, and could do a little more touching up.


Pseudo Code:
____________________________________________________

2nd Language option:
FUNCTION selectLanguage()
  PRINT "Select Language: 1. English, 2. Norwegian"
  languageChoice = GET_USER_INPUT
  IF languageChoice == "1" THEN
    LOAD language dictionary "dictionary_en.mjs"
  ELSE IF languageChoice == "2" THEN
    LOAD language dictionary "dictionary.mjs"
  ELSE
    PRINT "Invalid choice. Defaulting to Norwegian."
    LOAD language dictionary "dictionary.mjs"
  END IF
END FUNCTION


____________________________________________________


Start screen:
FUNCTION showStartScreen()
  CLEAR_SCREEN
  PRINT "Welcome to Rock Paper Scissors!" (in selected language)
  PRINT "Press Enter to start..." (in selected language)
  WAIT for Enter key press
END FUNCTION

____________________________________________________


Replay loop:
FUNCTION mainGameLoop()
  WHILE playAgain == TRUE
    showStartScreen()
    playerChoice = getPlayerChoice()
    aiChoice = getAIChoice()
    determineWinner(playerChoice, aiChoice)
    PRINT results (in selected language)
    playAgain = getPlayAgainConfirmation()
  END WHILE
END FUNCTION

FUNCTION getPlayAgainConfirmation()
  PRINT "Play again? (y/n)" (in selected language)
  input = GET_USER_INPUT
  IF input == "y" THEN
    RETURN TRUE
  ELSE
    RETURN FALSE
  END IF
END FUNCTION

# Rock, Paper, Scissors, Spock, Lizard! Coding:

Refactoring decisions:
The initial version had a lot of nested if-else if statements to determine the winner. This made the code hard to read and understand, especially as the number of choices increased. Instead I created a separate evaluateWinner function. The function uses (WIN_CONDITIONS) to improve readability and simplify the game logic.

I introduced some constants (CHOICES, LIST_OF_CHOICES) to make the code more readable and less prone to errors.

Pseudo Code:
FUNCTION playGame()
  GET player1Choice 
  GET player2Choice  

  IF player1Choice == player2Choice THEN
    PRINT "It's a tie!"  
  ELSE 

    IF player1Choice == "rock" THEN
      IF player2Choice == "scissors" OR player2Choice == "lizard" THEN
        PRINT "Player 1 wins!"
      ELSE
        PRINT "Player 2 wins!"
      END IF
    END IF

  END IF

END FUNCTION

FUNCTION isValidChoice(choice)
  validChoices = ["rock", "paper", "scissors", "spock", "lizard"] //I can just use this, right?
    RETURN TRUE
  ELSE
    RETURN FALSE
  END IF
END FUNCTION
