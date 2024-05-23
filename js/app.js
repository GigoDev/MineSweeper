'use strict'

const MINE = '💣'
const EMPTY = ' '
const FLAG = '🚩'

let gBoard

// {
//     minesAroundCount: 4,
//     isShown: false,
//     isMine: false,
//     isFlagged: true
// }
let gMinesPoss

let gLevel = {
    SIZE: 4,
    MINES: 2
}

let gGame

function onInit() {

    resetGlobals()
    toggleModal()
    buildBoard()
    renderBoard()
    startTimer()
    updateFlagsCount()
}

function resetGlobals() {
    gMinesPoss = []

    gGame = {
        isOn: true,
        shownCount: 0,
        flaggedCount: 0,
        secsPassed: 0,
    }
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
    //  // model:
    //      gBoard[pos.row][pos.col].isMine = true
    //    // dom:
    // gMinesPoss.push({ row:i, col:j })
    // }

    gBoard[1][1].isMine = true
    gBoard[2][2].isMine = true
    gMinesPoss.push({ row: 1, col: 1 })
    gMinesPoss.push({ row: 2, col: 2 })


}

function setMinesNegsCount() {
    for (let i = 0; i < gMinesPoss.length; i++) {
        let pos = gMinesPoss[i]
        countNegs(pos.row, pos.col)
    }
}

function renderBoard() {
    let strHTML = ''
    for (let i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < gBoard.length; j++) {
            const currCell = gBoard[i][j]
            let className = getClassName({ i, j })

            strHTML += `<td
                        class="${className}"
                        onmousedown="OnCellClicked(this,event,${i},${j})">`
            '</td >'
        }
        strHTML += '</tr>'
    }

    // onclick="OnCellClicked(this,${i},${j})"  
    // oncontextmenu="onCellFlaged(this,${i},${j});return false"
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

}


function OnCellClicked(elCell, ev, i, j) {

    if (!gGame.isOn) return
    let cell = gBoard[i][j]

    //  update model:

    if (!ev.button) { // left-Click 
        if (cell.isFlagged) return
        cell.isShown = true
        gGame.shownCount++
        if (gGame.shownCount === 1) {
            randomizeMines()
            setMinesNegsCount()
        }
        // if (!cell.minesAroundCount) expandShown(i,j)
    } else {  // right-click
        if (cell.isShown) return
        gGame.flaggedCount++
        cell.isFlagged = !cell.isFlagged
    }

    // update dom:
    updateFlagsCount()
    renderCell(elCell, cell, ev)
    checkGameOver(cell)
}

function renderCell(elCell, cell, ev = { button: 0 }) {

    if (!ev.button) { // left-click
        elCell.style.backgroundColor = 'white'
        if (cell.isMine) elCell.innerText = MINE
        else elCell.innerText = cell.minesAroundCount ? `${cell.minesAroundCount}` : EMPTY
    } else { // right-click
        elCell.innerText = cell.isFlagged ? FLAG : EMPTY
    }
}

function updateFlagsCount() {
    document.querySelector('.flagsCount span').innerText = `${gLevel.MINES - gGame.flaggedCount} `
}

function checkGameOver(cell) {

    const emptyCellsCount = gLevel.SIZE ** 2 - gLevel.MINES

    if (cell.isMine && cell.isShown) { // game lost
        document.querySelector('.modal span').innerText = ' lost '
        gameOver()
    } else if (gGame.flaggedCount === gLevel.MINES && // game won
        gGame.shownCount === emptyCellsCount) {
        document.querySelector('.modal span').innerText = ' won '
        gameOver()
    }
}

function expandShown( cellI, cellJ) {
    
    let cells = getNegsCells(cellI,cellJ) // {cell,elCell}
    for (let i = 0; i < cells.length; i++) {
        let cellArgs =cells[i]
        console.log(cellArgs);
        renderCell(cellArgs.cell,cellArgs.elCell)
    }
}

function toggleModal() {
    document.querySelector('.modal').hidden = gGame.isOn
}

function revealMines() {


    for (let i = 0; i < gMinesPoss.length; i++) {
        let pos = gMinesPoss[i]
        let elCell = document.querySelector(`.cell-${pos.row}-${pos.col}`)
        let cell = gBoard[pos.row][pos.col]
        renderCell(elCell, cell)
    }
}

function gameOver() {
    gGame.isOn = false
    revealMines()
    toggleModal()
}

function getMinesPoss() {
    let elMines = document.querySelectorAll('.mine')
    let minesPoss = []

    for (let i = 0; i < elMines.length; i++) {
        let cellClass = elMines[i].classList[0] // classList[0] is 'cell-i-j'
        let pos = getCellPosByClass(cellClass)
        minesPoss.push(pos)
    }
}

function onSetDifficulty(Level) {
    switch (Level) {
        case 'Easy':
            gLevel.SIZE = 4
            gLevel.MINES = 2
            onInit()
            break
        case 'Medium':
            gLevel.SIZE = 8
            gLevel.MINES = 14
            onInit()
            break
        case 'Hard':
            gLevel.SIZE = 12
            gLevel.MINES = 32
            onInit()
            break
    }
}





