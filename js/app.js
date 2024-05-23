'use strict'

const MINE = '💣'
const EMPTY = ' '
const FLAG = '🚩'
const LIFE = '❤️'
const NORMAL = '😀'
const DEAD = '😵'
const WIN = '😎'

let gBoard
let gGame
let gMinesPoss

let gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {

    resetGlobals()
    toggleModal()
    buildBoard()
    renderBoard()
    startTimer()
    renderFlagsCount()
    renderLives()
    renderResetBtn(NORMAL)
}

function resetGlobals() {
    gMinesPoss = []

    gGame = {
        isOn: true,
        shownCount: 0,
        flagsCount: gLevel.MINES,
        secsPassed: 0,
        livesCount: gLevel.MINES === 2 ? 1 : 3
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

    for (let i = 0; i < gLevel.MINES; i++) {
        let pos = findEmptyPos() // {row:i,col:j}
        // model:
        gBoard[pos.row][pos.col].isMine = true
        // dom:
        gMinesPoss.push(pos)
    }

    console.log(gMinesPoss);

    // gBoard[1][3].isMine = true
    // gBoard[1][2].isMine = true
    // gMinesPoss.push({ row: 1, col: 3 })
    // gMinesPoss.push({ row: 1, col: 2 })


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

        if (cell.isFlagged || cell.isShown) return

        cell.isShown = true
        gGame.shownCount++
        if (gGame.shownCount === 1) {
            randomizeMines()
            setMinesNegsCount()
        }
        if (!cell.minesAroundCount && !cell.isMine) expandShown(i, j)

    } else {  // right-click

        if (cell.isShown || (!gGame.flagsCount && !cell.isFlagged)) return

        if (!cell.isFlagged) { // Flag cell
            gGame.flagsCount--
            cell.isFlagged = true
        } else { //unFlag cell
            gGame.flagsCount++
            cell.isFlagged = false
        }
    }

    // update dom:
    renderFlagsCount()
    renderCell(elCell, cell, ev)
    checkGameOver(cell)
}

function renderCell(elCell, cell, ev = { button: 0 }) {

    if (!ev.button) { // left-click
        elCell.style.backgroundColor = '#A3C1AD'
        if (cell.isMine) elCell.innerText = MINE
        else elCell.innerText = cell.minesAroundCount ? `${cell.minesAroundCount}` : EMPTY
    } else { // right-click
        elCell.innerText = cell.isFlagged ? FLAG : EMPTY
    }
}

function renderFlagsCount() {
    document.querySelector('.flagsCount span').innerText = `${gGame.flagsCount} `
}

function checkGameOver(cell) {

    (gGame.shownCount + gGame.flagsCount) === gLevel.SIZE ** 2

    if (cell.isMine && cell.isShown) { // lose life
        gGame.livesCount--
        renderLives()

        if (gGame.livesCount >= 0) return
        else { // lose game
            renderResetBtn(DEAD)
            document.querySelector('.modal span').innerText = ' lost '
            gameOver()
        }
        return
    }

    let isBoardMarked = (gGame.shownCount + gGame.flagsCount) === gLevel.SIZE ** 2
    let isMinesMarked = checkAllMinesMarked()

    if (isBoardMarked && isMinesMarked) { // game won
        document.querySelector('.modal span').innerText = ' won '
        renderResetBtn(WIN)
        gameOver()
    }
}

function checkAllMinesMarked() {

    for (let i = 0; i < gMinesPoss.length; i++) {
        let pos = gMinesPoss[i]
        let cell = gBoard[pos.row][pos.col]

        if (cell.isShown || cell.isFlagged) continue
        else return false
    }
    return true
}

function expandShown(cellI, cellJ) {

    let cells = getNegsCells(cellI, cellJ) // returns renderCell() args [{elCell,cell}]
    for (let Idx = 0; Idx < cells.length; Idx++) {
        let cell = cells[Idx].cell
        let elCell = cells[Idx].elCell
        gGame.shownCount++
        cell.isShown = true
        renderCell(elCell, cell)
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

function renderLives() {
    let elDiv = document.querySelector('.lives')
    let str = ''
    for (let i = 0; i < gGame.livesCount; i++) {
        str += LIFE
    }
    elDiv.innerHTML = str
}

function renderResetBtn(emojy) {
    let elDiv = document.querySelector('.reset')
    elDiv.innerHTML = emojy
}





