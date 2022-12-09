import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

type Position = { x: number, y: number }

const add: (a: Position, b: Position) => Position = (a, b) => ({
    x: a.x + b.x,
    y: a.y + b.y
})

const eq: (a: Position, b: Position) => boolean = (a, b) => a.x === b.x && a.y === b.y

const follow = (positions: Position[], head: number, tail: number) => {
    const { x: hx, y: hy } = positions[head]
    const { x: tx, y: ty } = positions[tail]
    
    if (Math.abs(hx - tx) <= 1 && Math.abs(hy - ty) <= 1) {
        return undefined
    }

    positions[tail] = add(positions[tail], {
        x: Math.sign(hx - tx),
        y: Math.sign(hy - ty)
    })

    if (tail === positions.length - 1) {
        return positions[tail]
    }
    return undefined
}

const movements = fileContent
    .split('\n')
    .map<Position>(row => {
        const [direction, rawAmount] = row.split(' ')
        const amount = parseInt(rawAmount)
        if (direction === 'R') return { x: amount, y: 0 }
        if (direction === 'U') return { x: 0, y: amount }
        if (direction === 'L') return { x: -amount, y: 0 }
        if (direction === 'D') return { x: 0, y: -amount }
        throw new Error(`invalid: ${row}`)
    })

const solve = (positions: Position[]) => {
    const tailTrace = new Set([JSON.stringify({ x: 0, y: 0 })])
    movements.forEach(movement => {
        const targetPosition = add(positions[0], movement)
        do {
            positions[0] = add(positions[0], {
                x: Math.sign(targetPosition.x - positions[0].x),
                y: Math.sign(targetPosition.y - positions[0].y),
            })
    
            for (var i=1; i<positions.length; i++) {
                const newTailPosition = follow(positions, i-1, i)
                if (newTailPosition !== undefined) {
                    tailTrace.add(JSON.stringify(newTailPosition))
                }
            }
        } while (!eq(targetPosition, positions[0]))
        
    })

    return tailTrace.size
}

const partOne = solve([
    { x: 0, y: 0 },
    { x: 0, y: 0 }
])
console.log(`Part one result: ${partOne}`)

const partTwo = solve([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
])
console.log(`Part two result: ${partTwo}`)

