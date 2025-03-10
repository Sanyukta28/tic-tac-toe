// 1. Using useCallback for Event Handlers
// In React, functions like event handlers can be re-created on each render. This is not necessarily a problem if you're dealing with simple components, but if your game grows in complexity, it may lead to unnecessary re-renders.

// handleSelectSquare and handlePlayerNameChange could benefit from useCallback, ensuring these functions are memoized and do not change unless necessary.

import { useCallback } from "react";

// Inside the App component:
const handleSelectSquare = useCallback((rowIndex, colIndex) => {
  setGameturns((prevTurns) => {
    const currentPlayer = derivedActivePlayer(prevTurns);
    const updatedTurns = [
      { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
      ...prevTurns,
    ];
    return updatedTurns;
  });
}, []);

const handlePlayerNameChange = useCallback((symbol, newName) => {
  setPlayers((prevPlayers) => ({
    ...prevPlayers,
    [symbol]: newName,
  }));
}, []);

// 2. Game Over Logic
// In your current setup, derivedWinner and isDraw are evaluated every render. This is fine for a small app like this, but it could be optimized if you wanted to scale.

// One potential improvement:

// Instead of checking for a winner in every render, you could add a gameOver state that’s updated once the game is over. This would prevent unnecessary evaluations of derivedWinner and isDraw every time the component re-renders.

// 3. Avoid Nested Maps in GameBoard.jsx
// Your GameBoard.jsx component contains nested map calls inside the render. This works fine, but it can be optimized for readability by simplifying or extracting the logic.

// You can create separate helper components or just simplify the JSX like this:

export default function GameBoard({ onSelectSquare, board }) {
  return (
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, colIndex) => (
              <li key={colIndex}>
                <button
                  onClick={() => onSelectSquare(rowIndex, colIndex)}
                  disabled={playerSymbol !== null}
                >
                  {playerSymbol || ""}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

// Note: Rendering null as an empty string (in playerSymbol || "") ensures that if a cell is empty, it won’t display null.

// 4. Extract the Game Logic and State into a Separate Hook
// The game logic could be moved to a custom hook, making the App component much cleaner and easier to maintain.

// Example:

import { useState, useEffect, useCallback } from "react";

export function useTicTacToe() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(PLAYERS);

  const activePlayer = derivedActivePlayer(gameTurns);
  const gameBoard = derivedGameBoard(gameTurns);
  const winner = derivedWinner(gameBoard, players);
  const isDraw = gameTurns.length === 9 && !winner;

  const handleSelectSquare = useCallback((rowIndex, colIndex) => {
    setGameTurns((prevTurns) => {
      const currentPlayer = derivedActivePlayer(prevTurns);
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }, []);

  const handlePlayerNameChange = useCallback((symbol, newName) => {
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [symbol]: newName,
    }));
  }, []);

  const handleRestart = () => {
    setGameTurns([]);
  };

  return {
    gameTurns,
    gameBoard,
    activePlayer,
    winner,
    isDraw,
    handleSelectSquare,
    handlePlayerNameChange,
    handleRestart,
  };
}

//Then, in your App component, you would just call this hook:

function App() {
  const {
    gameTurns,
    gameBoard,
    activePlayer,
    winner,
    isDraw,
    handleSelectSquare,
    handlePlayerNameChange,
    handleRestart,
  } = useTicTacToe();

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || isDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

// 5. Player Name Handling in Player.jsx
// In Player.jsx, you have a simple input and button for editing player names. One improvement could be disabling the Edit button once the game is over to prevent users from editing player names after the game is completed.

<button onClick={handleClick} disabled={isActive && !isEditing && !winner}>
  {isEditing ? "Save" : "Edit"}
</button>;

// 6. Styling
// You might want to improve the CSS/Styling for better visual feedback:

// Active player highlight: Ensure that the active player is clearly visible (perhaps a color change or underline effect).
// Winner highlight: It would be great to display a more prominent visual feedback (e.g., a background color change or animation) when the winner is declared.
// 7. Accessibility Enhancements
// Add aria-label to buttons for better accessibility for screen readers.
// Ensure that color contrast is high enough for readability.

{
  <button
    onClick={() => onSelectSquare(rowIndex, colIndex)}
    disabled={playerSymbol !== null}
    aria-label={`Select square at row ${rowIndex + 1} and column ${
      colIndex + 1
    }`}
  >
    {playerSymbol || ""}
  </button>;
}

// 8. Code Quality Improvements
// Constants and Enumerations: You have a PLAYERS constant and WINNING_COMBINATIONS imported, which is great. Consider adding more constants for strings like "X", "O", and "Draw", so you avoid magic strings throughout the code.

const SYMBOLS = {
  X: "X",
  O: "O",
};

const GAME_STATUS = {
  DRAW: "Draw",
};
