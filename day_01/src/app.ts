import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')
const data = fileContent
    .split('\n')
    .reduce((acc, curr) => {
        if (curr === '') {
            acc.push([])
        } else {
            acc[acc.length - 1].push(parseInt(curr))
        }
        return acc
    }, [[]] as number[][])
    .map(arr => arr.reduce((a, b) => a + b))
    .sort((a, b) => b - a)


console.log(`Part one: ${data[0]}`)
console.log(`Part two: ${data[0] + data[1] + data[2] }`)
