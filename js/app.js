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
    flaggedCount: 0,
    secsPassed: 0,
}

let gTimerInterval

function onInit() {
    gGame.isOn = true
    gGame.secsPassed = 0
    buildBoard()
    randomizeMines()
    setMinesNegsCount()
    renderBoard()
    startTimer()

    document.querySelector('.flagsCount span').innerText = `${gLevel.MINES - gGame.flaggedCount}`
}

function buildBoard() {
    gBoard = createMat(gLevel.SIZE, gLevel.SIZE)
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
    //      
    // }

    gBoard[1][1].isMine = true
    gBoard[2][2].isMine = true


}

function setMinesNegsCount() {
    countNegs(1, 1)
    countNegs(2, 2)
}

function renderBoard() {
    let strHTML = ''
    for (let i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < gBoard.length; j++) {
            const currCell = gBoard[i][j]
            let className = getClassName({i,j})

            strHTML += `<td
                        class="${className}"
                        data-i="${i}"
                        data-j="${j}"
                        onclick="OnCellClicked(this)"  
                        oncontextmenu="onCellFlaged(this);return false" >`
            if (currCell.isMine) strHTML += MINE
            else if (currCell.minesAroundCount) strHTML += `${currCell.minesAroundCount}`
            else strHTML += EMPTY 
             '</td >' 
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    // document.querySelector('.mines').toggle
}


function OnCellClicked(elCell) {
    let cell = gBoard[elCell.dataset.i][elCell.dataset.j]
    if (cell.isFlagged) return
    cell.isShown = !cell.isShown
    gGame.shownCount++
    elCell.style.backgroundColor = 'white'
    elCell.style.color = 'black'
    if (cell.isMine) gameOver(false)
    else checkGameOver()
}

function onCellFlaged(elCell) {
    let cell = gBoard[elCell.dataset.i][elCell.dataset.j]
    if (cell.isShown) return
    gGame.flaggedCount++
    document.querySelector('.flagsCount span').innerText = `${ gLevel.MINES - gGame.flaggedCount } `
    cell.isFlagged = !cell.isFlagged
    elCell.classList.toggle('flagged')
    checkGameOver()
}

function checkGameOver() {
    const emptyCellsCount = gLevel.SIZE ** 2 - gLevel.MINES
    if (gGame.flaggedCount === gLevel.MINES &&
        gGame.shownCount === emptyCellsCount) gameOver(true)
}

function expandShown(board, elCell, i, j) {

}

function gameOver(isGameWon) {
    gGame.isOn = false
    clearInterval(gTimerInterval)
    // document.querySelector('.mines').toggle
    isGameWon ? alert('you won the game') : alert('you lost the game')

}



