import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

enum Gesture {
    rock, paper, scissors
}

enum Outcome {
    lost, draw, won
}

const cypher: Record<string, Gesture> = {
    'A': Gesture.rock,
    'B': Gesture.paper,
    'C': Gesture.scissors,
    'X': Gesture.rock,
    'Y': Gesture.paper,
    'Z': Gesture.scissors
}

const outcomeCypher: Record<string, Outcome> = {
    'X': Outcome.lost,
    'Y': Outcome.draw,
    'Z': Outcome.won
}

const gestureScore = {
    [Gesture.rock]: 1,
    [Gesture.paper]: 2,
    [Gesture.scissors]: 3 
}

const outcomeScore: Record<Gesture, number> = {
    [Outcome.lost]: 0,
    [Outcome.draw]: 3,
    [Outcome.won]: 6
}

const playMatch = (opponent: Gesture, self: Gesture) => {
    if (opponent === self) {
        return Outcome.draw
    }
    switch (opponent) {
        case Gesture.rock:
            return self === Gesture.paper ? Outcome.won : Outcome.lost
        case Gesture.paper:
            return self === Gesture.scissors ? Outcome.won : Outcome.lost
        case Gesture.scissors:
            return self === Gesture.rock ? Outcome.won : Outcome.lost
    }
}

const getGesture = (opponent: Gesture, outcome: Outcome) => {
    if (outcome === Outcome.draw) {
        return opponent
    }

    switch (opponent) {
        case Gesture.rock:
            return outcome === Outcome.won ? Gesture.paper : Gesture.scissors
        case Gesture.paper:
            return outcome === Outcome.won ? Gesture.scissors : Gesture.rock
        case Gesture.scissors:
            return outcome === Outcome.won ? Gesture.rock : Gesture.paper
    }
}

const partOneResult = fileContent
    .split('\n')
    .map(row => row
        .split(' ')
        .map(cypherText => cypher[cypherText])
    )
    .map(([opponent, self]) => {
        const outcome = playMatch(opponent, self)
        return outcomeScore[outcome] + gestureScore[self]
    })
    .reduce((a, b) => a + b)

console.log(`Part one: ${ partOneResult }`)

const partTwoResult = fileContent
    .split('\n')
    .map(row => {
        const [opponent, outcome] = row.split(' ')
        return [ cypher[opponent], outcomeCypher[outcome] ] as [Gesture, Outcome]
    })
    .map(([opponent, outcome]) => {
        const gesture = getGesture(opponent, outcome)
        return outcomeScore[outcome] + gestureScore[gesture]
    })
    .reduce((a, b) => a + b)

console.log(`Part two: ${ partTwoResult }`)
