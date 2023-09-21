import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=3, ncols=3, chanceLightStartsOn=0.25 }) {
  const [board, setBoard] = useState(createBoard());

  /** randomly determines if a given cell (on the initial board) is lit based on the chance provided in chanceLightStartsOn */
  function litOrNot(chance){
    let rand = Math.random();
    return rand <= chance ? true : false;
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    // Create the number of rows in the array (i.e. the arrays in the array/board)
    for (let i=0; i<nrows; i++){
      initialBoard.push([]);
    }

    // Using ncols and chanceLightStartsOn, creates a column and "randomly" selects if the cell starts as true or false
    for (let row of initialBoard){
      for(let i=0; i<ncols; i++){
        litOrNot(chanceLightStartsOn) ? row.push(true) : row.push(false)
      }
    }

    return initialBoard;
  }


  /** checks if any value on the board is false (not lit). If so, returns false. Otherwise (all lit/ true) returns true */
  function hasWon() {
    for (let row of board){
      if(row.includes(false)){
        return false
      }
    }
    return true
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = oldBoard.map(row => [...row]);


      flipCell(y, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);

      return boardCopy
    });
  }

  if(hasWon()){
    return(
      <div className="win-container">
        <h1 className="win-message">You won!</h1>
        <button className="reset-button" onClick={evt => setBoard(createBoard())}>Reset</button>
      </div>
    );
  }

  let tblBoard = [];

  for (let y=0; y<nrows; y++){
    const row = [];
    for (let x=0; x<ncols; x++){
      row.push(<Cell 
        key={`${y}-${x}`}
        flipCellsAroundMe={evt => flipCellsAround(`${y}-${x}`)}
        isLit={board[y][x]}
        />);
    }
    tblBoard.push(<tr key={y}>{row}</tr>);
  }

  return (<table className="tableBoard">
            <tbody>{tblBoard}</tbody>
          </table>
  );

}

export default Board;
