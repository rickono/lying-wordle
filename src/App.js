import { useState, useEffect } from 'react';
import './App.css';

import { Aa, La } from './words.js';

const Letter = ({ letter, color }) => {
  return (
    <div className='letter' style={{ backgroundColor: `${color}` }}>
      {letter}
    </div>
  );
};

const GameRow = ({ guess, realWord, guessLies }) => {
  return (
    <div className='game-row'>
      {Array.prototype.map.call(guess, (letter, idx) => {
        // 0: green, 1: yellow, 2: grey
        // 0: If lies[] is < 0.1, lie.
        // 1: If lies[] is < 0.05, green->yellow, yellow->grey, grey->green
        // 2: If lies[] is > 0.05, < 0.1, green<-yellow, yellow<-grey, grey<-green
        const colors = ['#5ae880', '#f7d95e', '#6f6f6f'];

        const lieType =
          guessLies[idx] >= 0.1 ? 0 : guessLies[idx] < 0.05 ? 1 : 2;
        const realColor =
          realWord[idx] === letter ? 0 : realWord.includes(letter) ? 1 : 2;

        const color =
          guess === realWord
            ? '#5ae880'
            : realWord[idx] === letter
            ? colors[(realColor + lieType) % 3]
            : realWord.includes(letter)
            ? colors[realColor + (lieType % 3)]
            : colors[realColor - (lieType % 3)];
        return <Letter letter={letter} color={color || '#5ae880'} />;
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

  useEffect(() => {
    setCurrentWord(Aa[Math.floor(Math.random() * Aa.length)]);
  }, []);

  const guessWord = (e) => {
    e.preventDefault();
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
      setFinished(currentGuess === currentWord);
      console.log(guesses);
    }
    setCurrentGuess('');
    console.log(currentWord);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h3>Lying Wordle</h3>
        {currentWord && (
          <div className='board'>
            {currentWord}
            {guesses.map((guess, idx) => {
              console.log(guess);
              return (
                <GameRow
                  guess={guess}
                  realWord={currentWord}
                  guessLies={lies[idx]}
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
                setCurrentGuess(e.target.value);
              }}
            />
            <button type='submit'>Guess</button>
          </form>
        )}
      </header>
    </div>
  );
}

export default App;
