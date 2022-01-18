import React from 'react';

const Letter = ({ letter, color }) => {
  return (
    <div className='letter' style={{ backgroundColor: `${color}` }}>
      {letter}
    </div>
  );
};

const GameRow = ({ guess, guessLies, game }) => {
  const { currentWord, lieRate } = game;
  return (
    <div className='game-row'>
      {Array.prototype.map.call(guess, (letter, idx) => {
        // colors[0: green, 1: yellow, 2: grey]
        const colors = ['#5ae880', '#f7d95e', '#6f6f6f'];
        // If lies[] is < lieRate/100, lie.
        // If lies[] is < 0.05, green->yellow, yellow->grey, grey->green
        // If lies[] is > 0.05, < 0.1, green<-yellow, yellow<-grey, grey<-green
        const lieType = (() => {
          if (guessLies[idx] <= lieRate / 100) {
            if (guessLies[idx] < lieRate / 200) {
              return 1;
            } else {
              return -1;
            }
          }
          return 0;
        })();
        const realColor =
          currentWord[idx] === letter
            ? 0
            : currentWord.includes(letter)
            ? 1
            : 2;

        const color =
          guess === currentWord ? '#5ae880' : colors[(realColor + lieType) % 3];
        return (
          <Letter
            letter={letter.toUpperCase()}
            color={color || colors[2]}
            key={guess + letter + idx}
          />
        );
      })}
    </div>
  );
};

const Board = ({ game }) => {
  const { guesses, lies } = game;
  console.log(guesses, game);
  return (
    <div className='board'>
      {guesses.map((guess, idx) => {
        return (
          <GameRow
            game={game}
            guess={guess}
            guessLies={lies[idx]}
            key={guess + idx}
          />
        );
      })}
    </div>
  );
};

export default Board;
