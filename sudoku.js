
selectedNumber = -1
moves = new Array();


gameBoard = new Array(9);
for(let i = 0; i < 9; i++){
  gameBoard[i] = new Array(9);
}

for (var i = 0; i < 2; i++) {
  for (var j = 0; j < 2; j++) {
    gameBoard[i][j] = "";
  }
}

digitCells = new Array(10)

//Create sudoku board
for (let i = 0; i < 3; i++){
  newSecRow = document.createElement('div');
  newSecRow.setAttribute("id", "board_row_"+i);
  newSecRow.setAttribute("class", "row");
  document.getElementById("board").appendChild(newSecRow);

  for (let j = 0; j < 3; j++){
    newSecCol = document.createElement('div');
    newSecCol.setAttribute("id", "board_col_"+j);
    newSecCol.setAttribute("class", "sector col");
    newSecRow.appendChild(newSecCol);
    
    for (let k = 0; k < 3; k++){
      newRow = document.createElement('div');
      newRow.setAttribute("id", "row_"+(k+i*3+1));
      newRow.setAttribute("class", "row");
      newSecCol.appendChild(newRow);

      for (let l = 0; l < 3; l++){
        newCell = document.createElement('div');
        newCell.setAttribute("id", "cell_"+(l+j*3)+""+(k+i*3));
        newCell.setAttribute("class", "cell selectable col");

        newCell.onclick = function(){
          placeNumber((l+j*3),(k+i*3));
        };

        newRow.appendChild(newCell);
        gameBoard[l+j*3][k+i*3] = newCell;
      }
    }
  
  }
}

//Create digit selection row
digitTable = document.createElement('div');
digitTable.setAttribute("class", "row");
document.getElementById("digit-table").appendChild(digitTable);
//Create digit selection buttons
for (let i = 1; i <= 9; i++){
  digit = document.createElement('div');
  digit.setAttribute("id", "digit_"+i);
  digit.setAttribute("class", "digit-cell selectable col");
  digit.innerHTML = i;
  digitCells[i-1] = digit;
  digit.onclick = function(){
    selectedNumber = i;
    clearErrors();
    clearHighlights();
    (digitCells[i-1]).classList.add("selected");
  };
  digitTable.appendChild(digit);
}


//Create eraser button
erase = document.createElement('div');
erase.setAttribute("id", "erase");
erase.setAttribute("class", "digit-cell selectable col");
erase.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-eraser-fill" viewBox="0 0 15 15"><path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/></svg>'
digitCells[9] = erase;
erase.onclick = function(){
  selectedNumber = "";
  clearErrors();
  clearHighlights();
  (digitCells[9]).classList.add("selected");
}
digitTable.appendChild(erase);



//Create undo button
undo = document.createElement('div');
undo.setAttribute("id", "undo");
undo.setAttribute("class", "digit-cell selectable col");
undo.onclick = function(){
  selectedNumber = -1;
  clearErrors();
  clearHighlights();
  undoMove();
};
digitTable.appendChild(undo);
// Add image to undo button
icon = document.createElement('img');
icon.setAttribute("src", "images/undo.png");
icon.setAttribute("style", "width:15px;height:15px;");
undo.appendChild(icon);


//Set initial values
setInitial()




function placeNumber(x, y) {
  if(selectedNumber != -1){
    if ((gameBoard[x][y]).innerHTML == "" || findMove(x,y,"")){
      if ((gameBoard[x][y]).innerHTML != selectedNumber && (selectedNumber == 0 || !checkMatches(x,y))){
        moves.push([x,y, (gameBoard[x][y]).innerHTML]);
        (gameBoard[x][y]).innerHTML = selectedNumber;
      }
    }
  }
}

function checkMatches(x, y) {
  returnVal = false;
  conflicts = new Array;
  for(let i = 0; i < 9; i++){
    for(let j = 0; j < 9; j++){
      if( !(i==x && j==y) && (gameBoard[i][j]).innerHTML == selectedNumber){
        if (sameBlock(x,y,i,j) || sameRow(y,j) || sameColumn(x,i)){
          returnVal = true;
        }
        conflicts.push([i,j]);
      }
    }
  }
  if(returnVal)
    highlightErrors(conflicts);
  return returnVal;
}

function highlightErrors(conflicts){
  for (let i = 0; i<9; i++){
    for (let k = 0; k<conflicts.length; k++){
      if(sameColumn(conflicts[k][0],i))
        errorCol(i);
    }
  }
  for (let i = 0; i<9; i++){
    for (let k = 0; k<conflicts.length; k++){
      if(sameRow(conflicts[k][1],i))
        errorRow(i);
    }
  }
  for (let i = 0; i<9; i+= 3){
    for (let j = 0; j<9; j+= 3){
      for (let k = 0; k<conflicts.length; k++){
        if(sameBlock(conflicts[k][0],conflicts[k][1], i, j))
        errorBlock(i,j);
      }
    }
  }
}

function sameBlock(x1, y1, x2, y2) {
  let firstRow = Math.floor(y1 / 3) * 3;
  let firstCol = Math.floor(x1 / 3) * 3;
  return (y2 >= firstRow && y2 <= (firstRow + 2) && x2 >= firstCol && x2 <= (firstCol + 2));
}

function sameRow(y1, y2) {
  return y1 == y2;
}

function sameColumn(x1, x2) {
  return x1 == x2;
}

function errorBlock(x, y) {
  for(k = 0; k < 3; k++){
    for(l = 0; l < 3; l++){
      if((gameBoard[k+x][l+y]).innerHTML == ""){
        (gameBoard[k+x][l+y]).classList.add("error");
      }
    }
  }
}

function errorRow(y) {
  for(k = 0; k < 9; k++){
    if((gameBoard[k][y]).innerHTML == ""){
      (gameBoard[k][y]).classList.add("error");
    }
  }
}

function errorCol(x) {
  for(k = 0; k < 9; k++){
    if((gameBoard[x][k]).innerHTML == ""){
      (gameBoard[x][k]).classList.add("error");
    }
  }
}

function clearHighlights(){
  for(let i = 0; i < digitCells.length; i++){
    (digitCells[i]).classList.remove("selected");
  }
}

function clearErrors(){
  for(let i = 0; i < 9; i++){
    for(let j = 0; j < 9; j++){ 
      (gameBoard[i][j]).classList.remove("error");
    }
  }
}

function undoMove(){
  if (moves.length > 0){
    console.table(moves);
    previousMove = moves.pop();
    gameBoard[previousMove[0]][previousMove[1]].innerHTML = previousMove[2];
  }
}

function findMove(x, y, value){
  for(let k = 0; k < moves.length; k++){
    //Only lets you change values that you actually placed.
    if(moves[k][0] == x && moves[k][1] == y)
      return true;
  }
  return false;
}


//Sets initial values. Is at the bottom instead of with the rest of page creation just to avoid clutter
function setInitial(){
  setInitValue(1,0,1);
  setInitValue(7,0,9);
  setInitValue(2,1,4);
  setInitValue(6,1,2);
  setInitValue(2,2,8);
  setInitValue(5,2,5);
  setInitValue(7,3,3);
  setInitValue(0,4,2);
  setInitValue(4,4,4);
  setInitValue(6,4,1);
  setInitValue(2,6,1);
  setInitValue(3,6,8);
  setInitValue(6,6,6);
  setInitValue(1,7,3);
  setInitValue(7,7,8);
  setInitValue(2,8,6);
}

function setInitValue(x, y, val){
  gameBoard[x][y].innerHTML = val;
  gameBoard[x][y].classList.add("initial");
}