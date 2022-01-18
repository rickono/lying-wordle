import { useState, useEffect } from 'react';
import './App.css';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

// https://www.npmjs.com/package/most-common-words-by-language
// https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt
// https://github.com/words/an-array-of-english-words

import { Aa, La } from './words.js';
import Board from './components/Board';

function App() {
  const [currentGuess, setCurrentGuess] = useState('');
  const [game, setGame] = useState({
    currentWord: null,
    guesses: [],
    lies: [],
    state: 1, // 0: not started, 1: in game, 2: finished+lost, 3: finished+won
    letters: new Set(),
    lieRate: 10,
  });

  useEffect(() => {
    setGame({
      ...game,
      currentWord: Aa[Math.floor(Math.random() * Aa.length)],
    });
  }, []);

  const guessWord = (e) => {
    if (e) {
      e.preventDefault();
    }
    // If the length of the word is 5, it is included in the allowed words, and word has not been used
    if (
      currentGuess.length === 5 &&
      (La.includes(currentGuess) || Aa.includes(currentGuess)) &&
      !game.guesses.includes(currentGuess)
    ) {
      // Update game: add guess to guesses, generate lies, add letters to used, update state
      setGame({
        ...game,
        guesses: [...game.guesses, currentGuess],
        lies: [
          ...game.lies,
          Array.prototype.map.call(currentGuess, (letter) => {
            return Math.random();
          }),
        ],
        letters: new Set(
          [...game.guesses, currentGuess]
            .map((word) => {
              return Array.prototype.map.call(word, (letter) => {
                return letter;
              });
            })
            .flat()
        ),
        state: (() => {
          // In game
          if (currentGuess !== game.currentWord) {
            return 1;
          }
          // Game won
          else if (currentGuess === game.currentWord) {
            return 3;
          }
        })(),
      });
    }
    setCurrentGuess('');
  };

  return (
    <div className='App'>
      <div className='App-header'>
        <label htmlFor=''>Lying Rate: {game.lieRate}%</label>
        <input
          type='range'
          min='0'
          max='100'
          step={10}
          value={game.lieRate}
          class='slider'
          onChange={(e) => setGame({ ...game, lieRate: e.target.value })}
          disabled={game.guesses.length !== 0}
        />
        <h3>Lying Wordle</h3>
        <p>Like Wordle, but if Kevin gave the hints.</p>

        {game.guesses.length > 0 && <p>Guesses: {game.guesses.length}</p>}
        {game.currentWord && <Board game={game} />}
        {game.state === 1 && (
          <form onSubmit={guessWord}>
            <input
              type='text'
              value={currentGuess}
              onChange={(e) => {
                e.preventDefault();
                setCurrentGuess(e.target.value.toLowerCase());
              }}
            />
            <button type='submit'>Guess</button>
          </form>
        )}
        <div className='buttons'>
          <button
            className='giveup'
            onClick={(e) => setGame({ ...game, state: 2 })}
          >
            Give Up
          </button>
          <button
            onClick={(e) => {
              setGame({
                ...game,
                state: 1,
                currentWord: Aa[Math.floor(Math.random() * Aa.length)],
                lies: [],
                guesses: [],
                letters: new Set(),
              });
            }}
          >
            New Game
          </button>
        </div>
        {[2, 3].includes(game.state) && `The word was ${game.currentWord}`}
        <Keyboard
          layout={{
            default: [
              'q w e r t y u i o p {bksp}',
              "a s d f g h j k l ; '",
              'z x c v b n m , . /',
            ],
          }}
          theme='hg-theme-default keyboard'
          buttonTheme={[
            {
              class: 'hg-red',
              buttons: Array(...game.letters).join(' '),
            },
          ]}
          display={{
            '{bksp}': 'delete',
            '{enter}': 'guess',
          }}
          onKeyPress={(button) => {
            if (button === '{bksp}') {
              setCurrentGuess(
                currentGuess.substring(0, currentGuess.length - 1)
              );
            } else {
              setCurrentGuess(game.currentGuess + button);
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;
