import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

const partOneResult = fileContent
    .split('\n')
    .map(row => row
        .split(',')
        .map(range => range
            .split('-')
            .map(x => parseInt(x))
        )
    )
    .filter(([ [a_from, a_to], [b_from, b_to] ]) => {
        const x = a_from >= b_from && a_to <= b_to
        const y = b_from >= a_from && b_to <= a_to
        return x || y
    })
    .length

console.log(`Part one: ${partOneResult}`)

const partTwoResult = fileContent
    .split('\n')
    .map(row => row
        .split(',')
        .map(range => range
            .split('-')
            .map(x => parseInt(x))
        )
    )
    .filter(([ [a_from, a_to], [b_from, b_to] ]) => {
        const x1 = a_from >= b_from && a_from <= b_to
        const x2 = a_to >= b_from && a_to <= b_to
        
        const y1 = b_from >= a_from && b_from <= a_to
        const y2 = b_to >= a_from && b_to <= a_to

        return x1 || x2 || y1 || y2
    })
    .length

console.log(`Part two: ${partTwoResult}`)
