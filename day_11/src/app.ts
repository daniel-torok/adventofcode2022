import assert from 'assert'
import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

type Monkey = {
    items: number[],
    trueIndex: number,
    falseIndex: number,
    operation: (val: number) => number,
    test: (val: number) => boolean,
    testNum: number,
    count: number
}
const monkeys: Monkey[] = []

const groupByEmptyLine: (lines: string[]) => string[][] = lines => {
    return lines.reduce((acc, curr) => {
        if (curr === '') {
            acc.push([])
            return acc
        }
        acc[acc.length - 1].push(curr)
        return acc
    }, [[]] as string[][])
}

const parseMonkey: (group: string[]) => Monkey = group => {
    const [_, startingItems, operation, test, testTrue, testFalse] = group
    var operationEval = operation.split('= ')[1]
    var testNum = parseInt(test.split('by ')[1])
    return {
        items: startingItems.split(': ')[1].split(', ').map(s => parseInt(s)),
        operation: old => {
            return eval(operationEval)
        },
        test: old => old % testNum === 0,
        testNum,
        trueIndex: parseInt(testTrue.split('monkey ')[1]),
        falseIndex: parseInt(testFalse.split('monkey ')[1]),
        count: 0
    }
}

const lines = fileContent
    .split('\n')
    .map(s => s.trim())


const groupedLines = groupByEmptyLine(lines)
groupedLines.forEach(group => {
    const monkey = parseMonkey(group)
    monkeys.push(monkey)
})

const runMonkey = (monkey: Monkey, common: number) => {
    monkey.items.forEach(item => {
        const operationResult = monkey.operation(item)
        //const newValue = Math.floor(operationResult / 3) // PART ONE
        const newValue = operationResult % common // PART TWO
        const nextIdx = (monkey.test(newValue)) ? monkey.trueIndex : monkey.falseIndex
        monkeys[nextIdx].items.push(newValue)
    })
    monkey.count += monkey.items.length
    monkey.items.length = 0
}

const common = monkeys.reduce((acc, curr) => acc * curr.testNum, 1)

for (var i=0; i<10000; i++) {
    for (var j=0; j<monkeys.length; j++) {
        runMonkey(monkeys[j], common)
    }
}

monkeys.sort((a, b) => Number(b.count) - Number(a.count))
console.log(monkeys.map(m => m.count))
console.log(monkeys[0].count * monkeys[1].count)