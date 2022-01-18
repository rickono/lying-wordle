import { useState, useEffect } from 'react';
import './App.css';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

// https://www.npmjs.com/package/most-common-words-by-language
// https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt
// https://github.com/words/an-array-of-english-words

import { Aa, La } from './words.js';

const Letter = ({ letter, color }) => {
  return (
    <div className='letter' style={{ backgroundColor: `${color}` }}>
      {letter}
    </div>
  );
};

const GameRow = ({ guess, realWord, guessLies, lieRate }) => {
  return (
    <div className='game-row'>
      {Array.prototype.map.call(guess, (letter, idx) => {
        // 0: green, 1: yellow, 2: grey
        // 0: If lies[] is < 0.1, lie.
        // 1: If lies[] is < 0.05, green->yellow, yellow->grey, grey->green
        // 2: If lies[] is > 0.05, < 0.1, green<-yellow, yellow<-grey, grey<-green
        const colors = ['#5ae880', '#f7d95e', '#6f6f6f'];
        const lieType =
          guessLies[idx] >= lieRate / 100
            ? 0
            : guessLies[idx] < lieRate / 200
            ? 1
            : -1;
        const realColor =
          realWord[idx] === letter ? 0 : realWord.includes(letter) ? 1 : 2;

        const color =
          guess === realWord
            ? '#5ae880'
            : realWord[idx] === letter
            ? colors[(realColor + lieType) % 3]
            : realWord.includes(letter)
            ? colors[(realColor + lieType) % 3]
            : colors[(realColor + lieType) % 3];
        return (
          <Letter
            letter={letter.toUpperCase()}
            color={color || '#6f6f6f'}
            key={guess + letter + idx}
          />
        );
      })}
    </div>
  );
};

function App() {
  const [currentWord, setCurrentWord] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [lies, setLies] = useState([]);
  const [finished, setFinished] = useState(false);
  const [letters, setLetters] = useState(new Set());
  const [lieRate, setLieRate] = useState(10);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setCurrentWord(Aa[Math.floor(Math.random() * Aa.length)]);
  }, []);

  const guessWord = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (
      currentGuess.length === 5 &&
      (La.includes(currentGuess) || Aa.includes(currentGuess)) &&
      !guesses.includes(currentGuess)
    ) {
      setGuesses([...guesses, currentGuess]);
      setLies([
        ...lies,
        Array.prototype.map.call(currentGuess, (letter) => {
          return Math.random();
        }),
      ]);
      const guessedLetters = new Set(
        [...guesses, currentGuess]
          .map((word) => {
            return Array.prototype.map.call(word, (letter) => {
              return letter;
            });
          })
          .flat()
      );
      setLetters(guessedLetters);
      setStarted(currentGuess !== currentWord);
      setFinished(currentGuess === currentWord);
    }
    setCurrentGuess('');
  };

  return (
    <div className='App'>
      <div className='App-header'>
        <label htmlFor=''>Lying Rate: {lieRate}%</label>
        <input
          type='range'
          min='0'
          max='100'
          value={lieRate}
          class='slider'
          onChange={(e) => setLieRate(e.target.value)}
          disabled={started}
        />
        <h3>Lying Wordle</h3>
        <p>Like Wordle, but if Kevin gave the hints.</p>

        {currentWord && (
          <div className='board'>
            {guesses.map((guess, idx) => {
              return (
                <GameRow
                  guess={guess}
                  realWord={currentWord}
                  guessLies={lies[idx]}
                  key={guess + idx}
                  lieRate={lieRate}
                />
              );
            })}
          </div>
        )}
        {!finished && (
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
          <button className='giveup' onClick={(e) => setFinished(true)}>
            Give Up
          </button>
          <button
            onClick={(e) => {
              setFinished(false);
              setCurrentWord(Aa[Math.floor(Math.random() * Aa.length)]);
              setLies([]);
              setGuesses([]);
              setLetters(new Set());
              setStarted(true);
            }}
          >
            New Game
          </button>
        </div>
        {finished && `The word was ${currentWord}`}
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
              buttons: Array(...letters).join(' '),
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
              setCurrentGuess(currentGuess + button);
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;
