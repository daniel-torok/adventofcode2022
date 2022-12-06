import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

const charCode = (char: string) => char.charCodeAt(0)
const isUpper = (char: string) => char === char.toUpperCase()

const getPriority = (letter: string) => {
    if (isUpper(letter)) {
        return charCode(letter) - charCode('A') + 1 + 26
    } else {
        return charCode(letter) - charCode('a') + 1
    }
}

const getCompartments = (rucksack: string) => [
    rucksack.substring(0, rucksack.length / 2),
    rucksack.substring(rucksack.length / 2)
]

const partOneResult = fileContent
    .split('\n')
    .map(getCompartments)
    .map(([ first, second ]) => {
        const firstSet = new Set(first)
        const secondSet = new Set(second)
        const intersection = new Set([...firstSet].filter(x => secondSet.has(x)))
        return [...intersection][0]
    })
    .map(getPriority)
    .reduce((a, b) => a + b)

console.log(`Part one: ${ partOneResult }`)

const partTwoResult = fileContent
    .split('\n')
    .reduce((acc, curr, index) => {
        if (index % 3 === 0) {
            acc.push([])
        }
        acc[acc.length - 1].push(curr)
        return acc
    }, [] as string[][])
    .map(group => {
        const [ first, ...rest ] = group
        return rest.reduce((acc, curr) => {
            const currSet = new Set(curr)
            return new Set([...acc].filter(x => currSet.has(x)))
        }, new Set(first))
    })
    .map(set => [...set][0])
    .map(getPriority)
    .reduce((a, b) => a + b)
    
console.log(`Part two: ${ partTwoResult }`)
