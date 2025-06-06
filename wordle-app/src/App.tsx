import { useEffect, useState } from 'react';
import './index.css';
import { WORD_LIST } from './wordList';

const WORD_LENGTH = 5;
const MAX_TRIES = 6;

type CellState = 'empty' | 'correct' | 'misplaced' | 'wrong';

interface Cell {
  letter: string;
  state: CellState;
}

function generateEmptyBoard(): Cell[][] {
  return Array.from({ length: MAX_TRIES }, () =>
    Array.from({ length: WORD_LENGTH }, () => ({ letter: '', state: 'empty' as CellState }))
  );
}

function pickWord() {
  const index = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[index];
}

export default function App() {
  const [board, setBoard] = useState<Cell[][]>(generateEmptyBoard());
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [solution, setSolution] = useState(pickWord);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (gameOver) return;
      const key = event.key.toLowerCase();
      if (key === 'enter') {
        if (col !== WORD_LENGTH) return;
        checkRow();
      } else if (key === 'backspace') {
        removeLetter();
      } else if (/^[a-z]$/.test(key)) {
        addLetter(key);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const addLetter = (letter: string) => {
    if (col >= WORD_LENGTH || row >= MAX_TRIES) return;
    setBoard(b => {
      const newBoard = b.map(r => r.map(c => ({ ...c })));
      newBoard[row][col].letter = letter;
      return newBoard;
    });
    setCol(col + 1);
  };

  const removeLetter = () => {
    if (col <= 0) return;
    setBoard(b => {
      const newBoard = b.map(r => r.map(c => ({ ...c })));
      newBoard[row][col - 1].letter = '';
      return newBoard;
    });
    setCol(col - 1);
  };

  const checkRow = () => {
    const guess = board[row].map(c => c.letter).join('');
    if (guess.length !== WORD_LENGTH) return;
    const newBoard = board.map(r => r.map(c => ({ ...c })));
    const solutionArr = solution.split('');
    const guessArr = guess.split('');

    guessArr.forEach((letter, i) => {
      if (letter === solutionArr[i]) {
        newBoard[row][i].state = 'correct';
        solutionArr[i] = '_';
        guessArr[i] = '*';
      }
    });

    guessArr.forEach((letter, i) => {
      if (letter === '*') return;
      const index = solutionArr.indexOf(letter);
      if (index !== -1) {
        newBoard[row][i].state = 'misplaced';
        solutionArr[index] = '_';
      } else {
        newBoard[row][i].state = 'wrong';
      }
    });

    setBoard(newBoard);
    if (guess === solution) {
      setMessage('Congratulations!');
      setGameOver(true);
    } else if (row + 1 === MAX_TRIES) {
      setMessage(`Game Over! The word was ${solution}`);
      setGameOver(true);
    } else {
      setRow(row + 1);
      setCol(0);
    }
  };

  const resetGame = () => {
    setBoard(generateEmptyBoard());
    setRow(0);
    setCol(0);
    setSolution(pickWord());
    setMessage('');
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      <h1 className="text-3xl font-bold">Wordle</h1>
      <div className="grid grid-rows-6 gap-1">
        {board.map((rowCells, r) => (
          <div key={r} className="grid grid-cols-5 gap-1">
            {rowCells.map((cell, c) => (
              <div
                key={c}
                className={`w-12 h-12 border flex items-center justify-center text-xl uppercase font-bold select-none ${
                  cell.state === 'correct'
                    ? 'bg-green-500 text-white'
                    : cell.state === 'misplaced'
                    ? 'bg-yellow-500 text-white'
                    : cell.state === 'wrong'
                    ? 'bg-gray-400 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      {message && <div className="mt-4 text-lg">{message}</div>}
      {gameOver && (
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={resetGame}>
          Restart
        </button>
      )}
    </div>
  );
}

