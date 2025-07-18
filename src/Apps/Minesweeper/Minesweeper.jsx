
import './Minesweeper.css'


import ico from './icon.png'
import assets from './minesweeper.png'


import {SIZE_VALUES} from './constants'

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import AppModel from '../../Models/AppModel'


// const width = 400
// const height = 500

function newCell(){
  return {
    bomb:false,
    revelated:false,
    flagged:false,
    question:false,
    exploded:false,
    neighbours:0
  }
}

function createBoard(columns,rows,difficulty){
  const board =[]

  //create cells all empty
  for(let i=0;i<columns;i++){
    const column = []
    for(let j=0;j<rows;j++){
      column.push(newCell())
    }
    board.push(column)
  }

  //add flavour to cells
  let bombs = Math.floor(columns*rows*difficulty/100)

  while(bombs>0){
    const j = Math.floor(Math.random()*rows)
    const i = Math.floor(Math.random()*columns)
    const c = board[j][i]
    if(!c.bomb){
      c.bomb=true
      bombs--;
    }
  }


  // Set the neighbors count for each cell
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (!board[i][j].bomb) {
        // Check the neighboring cells
        for (let x = i - 1; x <= i + 1; x++) {
          for (let y = j - 1; y <= j + 1; y++) {
            if (x >= 0 && x < columns && y >= 0 && y < rows) {
              if (board[x][y].bomb) {
                // Increment the neighbors count
                board[i][j].neighbours++;
              }
            }
          }
        }
      }
    }
  }



  return board
}


//libraries
const Minesweeper = forwardRef(({...props},ref) => {
  
  const [cells,setCells] = useState([])
  const [gameIsOver,setGameIsOver] = useState(false)
  const [gameIsWin,setGameIsWin] = useState(false)
  const [isMouseDown,setIsMouseDown] = useState(false)
  const [bombCount,setBombCount] = useState(123)
  const [startTime,setStartTime] = useState(undefined)
  const [elapsedTime, setElapsedTime] = useState(0);

  const {columns,rows} = SIZE_VALUES.small



  //SETUP
  useEffect(()=>{
  
    //create Cells
    const board = createBoard(columns,rows,15)
    setCells([...board])
    const bombs = board.flat().reduce((acc,v)=>acc+(v.bomb?1:0),0)
    setBombCount(bombs)
    
  },[columns,rows])

  //timer
  useEffect(() => {
    if(startTime!==undefined && (!gameIsOver && !gameIsWin)){

      const interval = setInterval(() => {
        const currentTime = new Date();
        const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(Math.min(elapsed,999));
      }, 1000);
  
      return () => {
        clearInterval(interval);
      };
      
    }
  }, [startTime,gameIsOver,gameIsWin]);
  

  //cells updater
  const updateCells = (callback) => {
    setCells((prevCells) => {
      return callback(JSON.parse(JSON.stringify(prevCells)));
    });
  };


  //gives the class for the cell
  function getClass(cell){

    if(cell.exploded) return "bombdeath"

    if(gameIsOver){
      if(cell.bomb && cell.flagged) return "bombmisflagged"
      if(cell.bomb) return "bombrevealed"
    }
    
    if(cell.question) return "question"
    if(cell.flagged) return "bombflagged"
    if(cell.revelated) return `open${cell.neighbours}`
    
    return "blank"
  }


  //get the digit of a number (for timer and counter)
  function getDigit(number, position) {
    const digit = Math.floor(Math.abs(number) / 10 ** position) % 10;
    return digit;
  }


  //function chekcs if the user has marked or revealed all bombs to declare WIN
  function cehckWin(cellMatrix){

    //check all cells revealed except bombs
    const win = cellMatrix.flat().every(cell=>cell.bomb?!cell.revelated:cell.revelated)

    if(win){
      setGameIsWin(true)
    }
    return win
  }


  //function calls recursively the neighbours to reveal
  function revealCellNeighbours(cellMatrix,x,y){
    const cell = cellMatrix[y][x]
    cell.revelated=true
    if (cell.neighbours === 0) {
      // Call the function for all neighboring cells
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
          const newX = x + xOffset;
          const newY = y + yOffset;
  
          // Check if the new coordinates are within the matrix bounds
          if (
            newX >= 0 &&
            newX < cellMatrix[0].length &&
            newY >= 0 &&
            newY < cellMatrix.length
          ) {
            const neighborCell = cellMatrix[newY][newX];
  
            // Recursively call the function for neighboring cells that are not revealed and not bombs
            if (!neighborCell.revelated && !neighborCell.bomb) {
              revealCellNeighbours(cellMatrix, newX, newY);
            }
          }
        }
      }
    }
  
    return cellMatrix
  }


  //LEFT CLICK
  function handleCellClick(event,x,y){
    event.preventDefault()
    if(gameIsOver || gameIsWin) return
    if(startTime===undefined) setStartTime(new Date())

    updateCells(newCells=>{
      
      const cell = newCells[y][x]
      //dont handle marked cells
      if(cell.flagged || cell.question) return newCells

      cell.revelated = true
      if(cell.bomb) {
        cell.exploded = true
        setGameIsOver(true)
      }else{
        //if bomb neighbours === 0
        revealCellNeighbours(newCells,x,y)
      }

      cehckWin(newCells)
      
      return newCells
    })
  }

  //RIGHT CLICK
  function handleCellContext (event,x,y){
    event.preventDefault();
    if(gameIsOver || gameIsWin) return
    if(startTime===undefined) setStartTime(new Date())

    updateCells(newCells=>{
      const cell = newCells[y][x]

      if(cell.revelated) return newCells

      //flip; nothing -> flag -> ? -> nothing...
      const newFlag = !cell.question && !cell.flagged
      const newQuestion =!cell.question && cell.flagged
      cell.flagged = newFlag
      cell.question = newQuestion
    
      //count bombs discounting flags
      const bombs = newCells.flat().reduce((acc,v)=>
        acc + (v.flagged ? 0 : 1) + (!v.bomb?-1:0)
      ,0)
      setBombCount(bombs)

      return newCells
    })
  }




  //restart
  function handleFaceClick(){
    setGameIsOver(false)
    setStartTime(undefined)
    const board = createBoard(columns,rows,15)
    setCells([...board])
    const bombs = board.flat().reduce((acc,v)=>acc+(v.bomb?1:0),0)
    setBombCount(bombs)
    setElapsedTime(0)
    setGameIsWin(false)
  }



  useImperativeHandle(ref, () => ({
    handleFaceClick
  }))

  const backgroundImageStyle = { backgroundImage: `url(${assets})` }

  return<>
  {/* style={{width:`${width}px`,height:`${height}px`}} */}
    <div  className='Window__minesweeper'>
        <header className='mine__header'>
          <div className="mine__header--counter">
              <div className={`digit num${getDigit(elapsedTime,2)}`} style={backgroundImageStyle}></div>
              <div className={`digit num${getDigit(elapsedTime,1)}`} style={backgroundImageStyle}></div>
              <div className={`digit num${getDigit(elapsedTime,0)}`} style={backgroundImageStyle}></div>
          </div>
          {/* <div className="mine__header--settings settingsOn" style={backgroundImageStyle}></div> */}
          <div className={"mine__header--face "+(gameIsWin?"facewin":gameIsOver?"facedead":isMouseDown?"faceooh":"facesmile")} 
            style={backgroundImageStyle}
            onClick={handleFaceClick}
          ></div>
          {/* <div className="mine__header--phoneSwitch" style="display: none;"></div> */}
          <div className="mine__header--timer">
              <div className={`digit num${getDigit(bombCount,2)}`} style={backgroundImageStyle}></div>
              <div className={`digit num${getDigit(bombCount,1)}`} style={backgroundImageStyle}></div>
              <div className={`digit num${getDigit(bombCount,0)}`} style={backgroundImageStyle}></div>
          </div>
      </header>
      <div className='mine__grid'>  

          {
        cells.map((cellRow,y) =>
          cellRow.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={"mine__cell " + getClass(cell)}
              style={backgroundImageStyle}
              onClick={(e)=>handleCellClick(e,x,y)}
              onContextMenu={(e)=>handleCellContext(e,x,y)}

              onMouseDown={()=>setIsMouseDown(true)}
              onMouseUp={()=>setIsMouseDown(false)}
            ></div>
          ))
        )
      }
      </div>


    </div>
  
  </>
})

export default  (props) => new AppModel({
  title: "Minesweeper",
  icon: ico,
  component: Minesweeper,
  description: "A simple minesweeper game.",
  noWhiteBackground: true,
  menus: (ref) => [
    {
      title: 'Settings',
      menus: [
        {
          title: 'Restart',
          action: () => ref?.current?.handleFaceClick()
        }
      ]
    }
  ],
  ...props
})


