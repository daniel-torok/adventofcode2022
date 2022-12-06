import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

const lines = fileContent.split('\n')
const numOfStacks = parseInt(lines[0])

/*const stacks_1 = lines
    .slice(1, numOfStacks + 1)
    .map(x => x.split(''))

lines
    .splice(numOfStacks + 1)
    .map(command => {
        const [_1, move, _2, from, _3, to] = command.split(' ')
        return [ parseInt(move), parseInt(from), parseInt(to) ]
    })
    .forEach(([move, from, to]) => {
        const fromIndex = from - 1
        const toIndex = to - 1
        const cratesToMove = Array.from({length: move}, () => stacks_1[fromIndex].pop()!)
        stacks_1[toIndex] = [ ...stacks_1[toIndex], ...cratesToMove ]
    })

const partOneResult = stacks_1
    .map(s => s[s.length - 1])
    .join('')

console.log(`Part one: ${partOneResult}`)*/

const stacks_2 = lines
    .slice(1, numOfStacks + 1)
    .map(x => x.split(''))

lines
    .splice(numOfStacks + 1)
    .map(command => {
        const [_1, move, _2, from, _3, to] = command.split(' ')
        return [ parseInt(move), parseInt(from), parseInt(to) ]
    })
    .forEach(([move, from, to]) => {
        const fromIndex = from - 1
        const toIndex = to - 1
        const cratesToMove = Array.from({length: move}, () => stacks_2[fromIndex].pop()!)
        stacks_2[toIndex] = [ ...stacks_2[toIndex], ...cratesToMove.reverse() ]
    })

const partTwoResult = stacks_2
    .map(s => s[s.length - 1])
    .join('')

console.log(`Part two: ${partTwoResult}`)
