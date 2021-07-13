import { useEffect, useState } from 'react';
import { Image } from 'rebass';
import { Row, Col } from 'react-bootstrap';
import { generatePhotoPlaceholderURL } from 'react-placeholder-image';
// import './App.css';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const shuffleArray = (array) => {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  };
  return array;
}

const getCards = () => {
  const baseTenCards = Array.from(Array(10)).map((_, i) => {
    return {
      baseId: i,
      chosen: false,
      matched: false,
      image: generatePhotoPlaceholderURL(150, 150),
    };
  });
  const allTwentyCards = [...baseTenCards, ...baseTenCards];
  const shuffledCards = shuffleArray(allTwentyCards);
  return shuffledCards;
}

function App() {
  const [cards, setCards] = useState([]);
  const [firstMatch, setFirstMatch] = useState(null);
  const [secondMatch, setSecondMatch] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isFirstPlayer, setFirstPlayer] = useState(true);
  const [firstPlayerScore, setFirstPlayerScore] = useState(0);
  const [secondPlayerScore, setSecondPlayerScore] = useState(0);

  useEffect(() => {
    const newCards = getCards();
    setCards([...newCards]);
    console.log(newCards);
  }, []);

  useEffect(() => {
    if (!firstMatch || !secondMatch) {
      return;
    }

    async function update() {
        await sleep(500);
        setFirstMatch(null);
        setSecondMatch(null);
        if (cards[firstMatch].baseId === cards[secondMatch].baseId && !matches.includes(firstMatch)) {
          setMatches([...matches, firstMatch, secondMatch]);

          if (isFirstPlayer) {
            setFirstPlayerScore(firstPlayerScore + 1);
          } else {
            setSecondPlayerScore(secondPlayerScore + 1);
          }
        } else {
          setFirstPlayer(!isFirstPlayer);
        }
    }

      update();

  }, [secondMatch, cards, firstMatch, matches, isFirstPlayer, firstPlayerScore, secondPlayerScore]);

  useEffect(() => {
    
  }, [secondMatch]);

  const chooseCard = cardNum => {
    if (!firstMatch) {
      setFirstMatch(cardNum);
    } else if (!secondMatch) {
      setSecondMatch(cardNum);
    }
  }

  const playerNum = isFirstPlayer ? 1 : 2;

  return (
    <div className="App">
      <Row>
        <Col>
          <center><h1>Player 1 Score:</h1> {firstPlayerScore}</center>
          <center><h1>Player 2 Score:</h1> {secondPlayerScore}</center>
          <center><strong>Player {playerNum} Turn</strong></center>
          <br />
        </Col>
      </Row>

      <Row xs={5} className="g-4">
        {cards.map((card, i) => {
          return (
            <Col>
              {i === firstMatch || i === secondMatch || matches.includes(i) ? (
                <Image src={card.image} />
              ) : (
                <div style={{height: 150, width: 150, backgroundColor: 'aliceblue'}} onClick={() => chooseCard(i)}>{card.chosen}</div>
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default App;
