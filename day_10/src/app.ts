import assert from 'assert'
import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

type Add = {
    type: 'add',
    amount: number
}
type Noop = {
    type: 'noop'
}
type Command = Add | Noop

type Instruction = (x: number) => Result

type Result = {
    during: number,
    after: number
}

const parse: (line: string) => Command = line => {
    const tokens = line.split(' ')
    if (tokens[0] === 'noop') return { type: 'noop' }
    if (tokens[0] === 'addx') return { type: 'add', amount: parseInt(tokens[1]) }

    throw new Error(`invalid: ${line}`)
}

const toCycles: (command: Command) => Instruction[] = command => {
    switch (command.type) {
        case 'noop': return [x => ({ during: x, after: x})]
        case 'add': return [
            x => ({ during: x, after: x}),
            x => ({ during: x, after: x + command.amount})]
    }
}

const getSprite: (pos: number) => string = pos => {
    const arr = Array.from({length: 40}, () => ' ')
    arr[pos] = '#'
    arr[pos - 1] = '#'
    arr[pos + 1] = '#'
    //console.log('sprite', arr.join(''))
    return arr.join('')
}

const run: (instructions: Instruction[], startValue: number) => Result = (instructions, startValue) => {
    const row: string[] = []
    const result = instructions.reduce((acc, curr, index) => {
        const res = curr(acc.after)
        const sprite = getSprite(res.during)
        row.push(sprite[index])
        //console.log('run', index + 1, res)
        return res
    }, { during: startValue, after: startValue } as Result)
    console.log(row.join(''))
    return result
}

const runSamples: (instructions: Instruction[], samples: number[]) => number = (instructions, samples) => {
    const subResult = samples.map(x => ({ during: 1, after: 1 } as Result))
    for (var i=1; i<samples.length; i++) {
        const subInstructions = instructions.slice(samples[i-1], samples[i])
        subResult[i] = run(subInstructions, subResult[i-1].after)
        //console.log(i, subResult[i])
    }

    assert(samples.length === subResult.length)

    var result = 0;
    for (var i=0; i<samples.length; i++) {
        const strength = samples[i] * subResult[i].during
        console.log('strength', i, strength)
        result += strength
    }
    return result
}

const instructions = fileContent
    .split('\n')
    .map(parse)
    .flatMap(toCycles)

//const sampleCycles = [0, 20, 60, 100, 140, 180, 220]
const sampleCycles = [0, 40, 80, 120, 160, 200, 240]
const result = runSamples(instructions, sampleCycles)

console.log(result)

 
//##..##..##..##..##..##..##..##..##..##..