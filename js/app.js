'use strict'

const MINE = '*'
const EMPTY = ' '

let gBoard 

// {
//     minesAroundCount: 4,
//     isShown: false,
//     isMine: false,
//     isFlagged: true
// }


let gLevel = {
    SIZE: 4,
    MINES: 2
}

let gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}



function onInit() {
    gGame.isOn = true
    buildBoard()
    randomizeMines()
    setMinesNegsCount()
    console.log(gBoard);
    renderBoard()
}

function buildBoard() {
    gBoard = createMat(gLevel.SIZE,gLevel.SIZE)
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = 
             {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isFlagged: false
            }
          
        }
    }
    
    
}

function randomizeMines() {
    // for (let i = 0; i < gLevel.MINES; i++) {
    //     let pos = findEmptyPos()
    //     console.log(pos);
    //      gBoard[pos.row][pos.col].isMine = true
    // }

    gBoard[1][1].isMine = true
    gBoard[2][2].isMine = true
  
}

function setMinesNegsCount() {
    countNegs(1,1)
    countNegs(2,2)
}

function renderBoard() {
    let strHTML = ''
	for (let i = 0; i < gBoard.length; i++) {
		strHTML += '<tr>'
		for (let j = 0; j < gBoard.length; j++) {
			const currCell = gBoard[i][j]
			let cellClass = getClassName({ i,j }) // cell-i-j

			strHTML += `<td 
                        class="cell ${cellClass}" 
                        onclick="OnCellClicked(this,${i},${j})"  
                        oncontextmenu="onCellFlaged(this,${i},${j});return false" >`
            if(currCell.isMine)  strHTML +=  MINE 
            else if(currCell.minesAroundCount) strHTML +=  `${currCell.minesAroundCount}`
            else strHTML += EMPTY
			strHTML += '</td>'
		}
		strHTML += '</tr>'
	}
	const elBoard = document.querySelector('.board')
	elBoard.innerHTML = strHTML
}


function OnCellClicked(elCell,i,j){
    let cell = gBoard[i][j]
    if (cell.isFlagged) return
    cell.isShown = !cell.isShown
    elCell.style.backgroundColor = 'white'
    elCell.style.color = 'black'
}

function onCellFlaged(elCell,i,j) {
    let cell = gBoard[i][j]
    if (cell.isShown) return
    cell.isFlagged = !cell.isFlagged
    elCell.classList.toggle('flagged')
}

function renderCell(elCell,i,j){
    // TODO:  centralize al cell renders here
}

function getPosById(elCell){
    // TODO: return pos{i,j} of elCell
}


function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}

function gameOver(){

}
