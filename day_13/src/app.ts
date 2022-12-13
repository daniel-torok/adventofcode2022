import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

type Packet = number | Packet[]

const isNumber = (packet: Packet): packet is number => {
    return (packet as number)?.toFixed !== undefined
}

type Pair = {
    left: Packet,
    right: Packet
}

type Result = 'continue' | boolean

const arePacketsInRightOrder: (left: Packet, right: Packet) => Result = (left, right) => {
    if (isNumber(left) && isNumber(right)) {
        return left === right ? 'continue' : left < right
    }

    if (!isNumber(left) && !isNumber(right)) {
        for (var i=0; i<left.length && right[i] !== undefined; i++) {
            const nextLeftPacket = left[i]
            const nextRightPacket = right[i]

            const result = arePacketsInRightOrder(nextLeftPacket, nextRightPacket)
            if (result !== 'continue') {
                return result
            }
        }
        return left.length === right.length ? 'continue' : left.length < right.length
    }
    
    return isNumber(left) ?
        arePacketsInRightOrder([left], right) :
        arePacketsInRightOrder(left, [right])
}

const isPairInRightOrder = (pair: Pair) => {
    const { left, right } = pair
    return arePacketsInRightOrder(left, right)
}

const data = fileContent
    .split('\n')
    .reduce((acc, curr, index) => {
        if ((index + 1) % 3 == 0) {
            acc.push([])
        } else {
            acc[acc.length - 1].push(curr)
        }
        return acc
    }, [[]] as string[][])
    .map(([ left, right ]) => ({
        left: eval(left) as Packet,
        right: eval(right) as Packet
    }) as Pair)
    .map((pair, index) => {
        return isPairInRightOrder(pair) ? index + 1 : 0
    })
    .reduce((a, b) => a + b)

console.log('part one', data)

const dataPartTwo = fileContent
    .split('\n')
    .filter(row => row !== '')
    .map(row => eval(row) as Packet)

const divider2 = [[2]]
const divider6 = [[6]]
dataPartTwo.push(divider2)
dataPartTwo.push(divider6)

const sorted = dataPartTwo.sort((a, b) => {
    return arePacketsInRightOrder(a, b) ? -1 : 1
})

const divider2Idx = sorted.findIndex(packet => packet === divider2) + 1
const divider6Idx = sorted.findIndex(packet => packet === divider6) + 1

console.log('part two', divider2Idx * divider6Idx)