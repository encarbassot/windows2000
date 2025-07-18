import { useEffect, useRef, useState } from 'react';
import AppModel from '../../Models/AppModel';
import './Solitario.css';
import Solitario_Card from './Solitario_Card.jsx';
  


// ------------------------------------ CONSTANTS ------------------------------------

const SIZE = 500
const CARD_WIDTH = SIZE/9
const CARD_HEIGHT = CARD_WIDTH*1.4
const COLUMNS = 7
const CARDS_PER_PAGE = 3 //paginas de la pila


function Solitario() {
  const boardRef = useRef(null)
  const [cards, setCards] = useState(setupBoard(generateDeck()))
  console.log(cards)



  function handleCardDrop(id,position){
    console.log("drop", id,position,detectZoneColumnOrSuit(position.x, position.y))
  }

  return (
    <div className="Solitario">
      <div className="board" ref={boardRef} style={{width:SIZE,height:SIZE}}>     

        {/* COLUMNS */}
        {
          cards.columns.map((column, colIndex) => 
            column.map((card, rowIndex) => (
              <Solitario_Card 
                card={card} 
                key={card.id} 
                positionOnBoard={calcPositionColumns(colIndex, rowIndex)}
                onDrop={handleCardDrop}
              />
            ))
          )
        }
        

        {/* MAZOS */}
        {
          cards.topSuits.map((suit, suitIndex) =>
            suit.slice(-2).map((card, cardIndex) => (
              <Solitario_Card
                card={card}
                key={card.id}
                positionOnBoard={calcPositionSuits(suitIndex, cardIndex)}
                onDrop={handleCardDrop}
              />
            ))
          )
        }


        {/* PILA */}
        {
          cards.stock.map((card, index, arr) => (
            <Solitario_Card
              card={card}
              key={card.id}
              positionOnBoard={calcPositionWaste(index,arr.length)}
              onDrop={handleCardDrop}
            />
          ))
        }

        


      </div>
    </div>
  )
}




export default (props) => new AppModel({
  title: 'Solitario',
  // icon:  
  component: Solitario,
  description: 'A classic card game',
  menus: [],
  ...props
});















// ------------------------------------ POSITIONING CARDS ------------------------------------

const ZONES_LAYOUT = {
  columns: {
    x: SIZE * 0.05,
    y: SIZE * 0.4,
    width: CARD_WIDTH,
    height: SIZE * 0.5,
    count: COLUMNS,
    spacing: (SIZE - (COLUMNS * CARD_WIDTH) - SIZE * 0.1) / (COLUMNS - 1),
    verticalSpacing: SIZE * 0.05
  },
  suits: {
    x: SIZE * 0.4,
    y: SIZE * 0.1,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    count: 4,
    spacing: SIZE * 0.04
  },
  waste: {
    x: SIZE * 0.1,
    y: SIZE * 0.1,
    width: CARD_WIDTH,
    height: CARD_HEIGHT
  }
}


function calcPositionWaste(index, length) {
  const { x, y } = ZONES_LAYOUT.waste
  const off = CARDS_PER_PAGE - (length % CARDS_PER_PAGE)
  const pageIndex = (index + off) % CARDS_PER_PAGE
  return {
    x: x + pageIndex * (CARD_WIDTH * 0.2),
    y
  }
}

function calcPositionColumns(colIndex, rowIndex) {
  const { x, y, spacing, width, verticalSpacing } = ZONES_LAYOUT.columns
  return {
    x: x + colIndex * (width + spacing),
    y: y + rowIndex * verticalSpacing
  }
}




function calcPositionSuits(suitIndex) {
  const { x, y, spacing, width } = ZONES_LAYOUT.suits
  return {
    x: x + suitIndex * (width + spacing),
    y
  }
}


function detectZoneColumnOrSuit(x, y) {
  const zones = ['columns', 'suits']
  
  for (const zoneName of zones) {
    const zone = ZONES_LAYOUT[zoneName]
    
    if (
      x >= zone.x &&
      x <= zone.x + zone.count * zone.width + (zone.count - 1) * zone.spacing &&
      y >= zone.y &&
      y <= zone.y + zone.height
    ) {
      for (let i = 0; i < zone.count; i++) {
        const itemX = zone.x + i * (zone.width + zone.spacing)

        if (x >= itemX && x <= itemX + zone.width) {
          return { zone: zoneName, index: i }
        }
      }
    }
  }

  return null
}





// ------------------------------------ CARDS ------------------------------------


class Card {
  constructor({ id, deck, value, x = 0, y = 0, width = 80, height = 120, draggable = false }) {
    this.id = id
    this.deck = deck
    this.value = value
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.draggable = draggable
    this.hidden = true
  }
}



// ------------------------------------ GENERATE DECK ------------------------------------


function generateDeck(){
  const cards = []
  let id = 0

  // Generate 52 cards: 4 decks × 13 values
  for (let deck = 1; deck <= 4; deck++) {
    for (let value = 0; value < 13; value++) {
      cards.push(
        new Card({
          id: id++,
          deck,
          value,
          x: 0,
          y: 0,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        })
      )
    }
  }

  // Shuffle cards using Fisher-Yates algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }

  return cards
}


function setupBoard(cards) {
  // cards: shuffled deck array

  // 7 columns: first column 1 card, second 2 cards, ... seventh 7 cards
  const columns = [[], [], [], [], [], [], []]

  let index = 0
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = cards[index++]
      // Show only last card in column
      card.hidden = row !== col
      columns[col].push(card)
    }
  }

  // Remaining cards to stock pile, all hidden
  const stock = cards.slice(index)
  stock.forEach(card => card.hidden = true)

  // Top piles empty at start
  const topWaste = []
  // const topSuits = [[], [], [], []] 
  const topSuits = [ [stock.pop()], [stock.pop()], [stock.pop()], [stock.pop()] ]

  return {
    columns,
    stock,
    topWaste,
    topSuits
  }
}
