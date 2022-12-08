import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

const grid = fileContent
    .split('\n')
    .map(row => row.split('').map(col => parseInt(col)))
const rowEndIdx = grid.length - 1
const colEndIdx = grid[0].length - 1

const isVisibleFromLeft = (rowIdx: number, colIdx: number) => {
    const element = grid[rowIdx][colIdx]
    for (var i=colIdx-1; i>=0; i--) {
        if (grid[rowIdx][i] >= element) return false
    }
    return true
}
const isVisibleFromRight = (rowIdx: number, colIdx: number) => {
    const element = grid[rowIdx][colIdx]
    for (var i=colIdx+1; i<=colEndIdx; i++) {
        if (grid[rowIdx][i] >= element) return false
    }
    return true
}
const isVisibleFromTop = (rowIdx: number, colIdx: number) => {
    const element = grid[rowIdx][colIdx]
    for (var i=rowIdx-1; i>=0; i--) {
        if (grid[i][colIdx] >= element) return false
    }
    return true
}
const isVisibleFromBottom = (rowIdx: number, colIdx: number) => {
    const element = grid[rowIdx][colIdx]
    for (var i=rowIdx+1; i<=rowEndIdx; i++) {
        if (grid[i][colIdx] >= element) return false
    }
    return true
}

const fns = [
    isVisibleFromLeft,
    isVisibleFromRight,
    isVisibleFromTop,
    isVisibleFromBottom
]

const isVisible = (rowIdx: number, colIdx: number) => {
    if (rowIdx === 0 || colIdx === 0) return true
    if (rowIdx === rowEndIdx || colIdx === colEndIdx) return true

    return fns.some(fn => fn(rowIdx, colIdx))
}

const visibleGrid = grid
    .map((row, rowIdx) => row
        .map((col, colIdx) => isVisible(rowIdx, colIdx))
    )

const partOneResult = visibleGrid
    .reduce((a, b) => a + b
        .reduce((x, y) => x + (y ? 1 : 0), 0),
        0
    )

console.log(partOneResult)

const getScenisScoreFromLeft = (rowIdx: number, colIdx: number) => {
    const element = grid[rowIdx][colIdx]
    for (var i=colIdx-1; i>=0; i--) {
        if (grid[rowIdx][i] >= element) return colIdx - i
    }
    return colIdx
}
const getScenisScoreFromRight = (rowIdx: number, colIdx: number) => {
    const element = grid[rowIdx][colIdx]
    for (var i=colIdx+1; i<=colEndIdx; i++) {
        if (grid[rowIdx][i] >= element) return i - colIdx
    }
    return colEndIdx - colIdx
}
const getScenisScoreFromTop = (rowIdx: number, colIdx: number) => {
    const element = grid[rowIdx][colIdx]
    for (var i=rowIdx-1; i>=0; i--) {
        if (grid[i][colIdx] >= element) return rowIdx - i
    }
    return rowIdx
}
const getScenisScoreFromBottom = (rowIdx: number, colIdx: number) => {
    const element = grid[rowIdx][colIdx]
    for (var i=rowIdx+1; i<=rowEndIdx; i++) {
        if (grid[i][colIdx] >= element) return i - rowIdx
    }
    return rowEndIdx - rowIdx
}

const s_fns = [
    getScenisScoreFromLeft,
    getScenisScoreFromRight,
    getScenisScoreFromTop,
    getScenisScoreFromBottom
]

const getScenicScore = (rowIdx: number, colIdx: number) => {
    if (rowIdx === 0 || colIdx === 0) return 0
    if (rowIdx === rowEndIdx || colIdx === colEndIdx) return 0

    return s_fns.reduce((acc, fn) => acc * fn(rowIdx, colIdx) , 1)
}

const scenicGrid = grid
    .map((row, rowIdx) => row
        .map((col, colIdx) => getScenicScore(rowIdx, colIdx) )
    )

const partTwoResult = scenicGrid
    .flatMap(x => x)
    .sort((a, b) => b - a)[0]

console.log(partTwoResult)