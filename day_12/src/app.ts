import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

type Type = 'start' | 'finish' | 'path'
type Position = {
    x: number,
    y: number
}
type Square = {
    type: Type,
    value: number,
    position: Position,
    steps: number
}


const getTypeForChar: (char: string) => Type = char => {
    switch (char) {
        case 'S': return 'start'
        case 'E': return 'finish'
        default: return 'path'
    }
}
const getValueForChar: (char: string) => number = char => {
    switch (char) {
        case 'S': return getValueForChar('a')
        case 'E': return getValueForChar('z')
        default: return char.charCodeAt(0) - 'a'.charCodeAt(0)
    }
}

const findSquare: (grid: Square[][], predicate: (type: Square) => boolean) => Square[] = (grid, predicate) => {
    const result: Square[] = []
    for (var rowIdx=0; rowIdx<grid.length; rowIdx++) {
        for (var colIdx=0; colIdx<grid[0].length; colIdx++) {
            if (predicate(grid[rowIdx][colIdx])) result.push(grid[rowIdx][colIdx])
        }
    }
    return result
}

const deltas: Position[] = [
    { x: 1, y: 0 }, // right
    { x: 0, y: 1 }, // down
    { x: -1, y: 0 }, // left
    { x: 0, y: -1 }, // up
]

const getPossibleSteps: (grid: Square[][], current: Square) => Square[] = (grid, current) => {
    const { x, y } = current.position
    return deltas
        .map(delta => ({
            x: delta.x + x,
            y: delta.y + y
        }))
        .filter(({x, y}) => {
            return x >= 0 && y >= 0 && x < grid[0].length && y < grid.length
        })
        .map(({x, y}) => grid[y][x])
}


const grid = fileContent
    .split('\n')
    .map((row, rowIdx) => row
        .split('')
        .map<Square>((char, colIdx) => ({
            type: getTypeForChar(char),
            value: getValueForChar(char),
            position: { x: colIdx, y: rowIdx },
            steps: Number.MAX_VALUE
        }))
    )

const copyGrid: (grid: Square[][]) => Square[][] = grid => grid.map(r => r.map(s => ({ 
    type: s.type,
    value: s.value,
    position: { x: s.position.x, y: s.position.y },
    steps: s.steps
})))

const run = (grid: Square[][], start: Square) => {
    const queue: Square[] = [start]
    const visited = new Set<string>()

    while (queue.length > 0) {
        const current = queue.shift()!
        //console.log('current', current)
        
        visited.add(JSON.stringify(current.position))
        //console.log('visited', visited)

        const possibleSteps = getPossibleSteps(grid, current)
        //console.log('possible', possibleSteps)

        const unvisited = possibleSteps.filter(step => !visited.has(JSON.stringify(step.position)))
        //console.log('unvisited', unvisited)

        const correctHeight = unvisited.filter(step => step.value <= current.value + 1)
        //console.log('correctHeight', correctHeight)

        const shorter = correctHeight.filter(step => current.steps + 1 < step.steps)
        //console.log('shorter', shorter)

        shorter.forEach(step => {
                step.steps = current.steps + 1
                queue.push(step)
            })
    }

    return findSquare(grid, square => square.type === 'finish')[0].steps
}

const partOneGrid = copyGrid(grid)
const partOneStart = findSquare(partOneGrid, square => square.type === 'start')[0]
partOneStart.steps = 0
console.log(run(partOneGrid, partOneStart))
 
const partTwo = findSquare(grid, square => square.value === 0)
    .map(square => square.position)
    .map(position => {
        const copy = copyGrid(grid)
        const start = copy[position.y][position.x]
        start.steps = 0
        return run(copy, start)
    })
    .sort((a, b) => a - b)[0]
console.log(partTwo)