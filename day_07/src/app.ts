import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')

type CdCommand = {
    type: 'cd',
    name: string
}

type LsCommand = {
    type: 'ls'
}

type Dir = {
    type: 'dir',
    name: string
}

type File = {
    type: 'file',
    name: string,
    size: number
}

type Line = Dir | File | CdCommand | LsCommand

const cdRegex = new RegExp('[$][ ]cd[ ](.*)')
const lsRegex = new RegExp('[$][ ]ls')
const dirRegex = new RegExp('dir[ ](.*)')
const fileRegex = new RegExp('(.*)[ ](.*)')

const parseLine: (line: string) => Line = line => {
    const cdMatch = line.match(cdRegex)
    if (cdMatch !== null) {
        return {
            type: 'cd',
            name: cdMatch[1]
        }
    }
    
    if (lsRegex.test(line)) {
        return {
            type: 'ls'
        }
    }

    const dirMatch = line.match(dirRegex)
    if (dirMatch !== null) {
        return {
            type: 'dir',
            name: dirMatch[1]
        }
    }

    const fileMatch = line.match(fileRegex)
    if (fileMatch !== null) {
        return {
            type: 'file',
            name: fileMatch[2],
            size: parseInt(fileMatch[1])
        }
    }

    throw new Error(`invalid: ${line}`)

}

type Node = {
    parent?: Node,
    name: string,
    children: (File | Node)[]
}

const root: Node = { parent: undefined, name: '/', children: [] }
fileContent
    .split('\n')
    .map(parseLine)
    .reduce((acc, curr) => {
        switch (curr.type) {
            case 'ls':
                return acc
            case 'cd':
                if (curr.name === '/') return root
                if (curr.name === '..') return acc.parent!
                return acc.children.find(node => node.name === curr.name) as Node
            case 'dir':
                acc.children.push({
                    parent: acc,
                    name: curr.name,
                    children: []
                } as Node)
                return acc
            case 'file':
                acc.children.push({
                    name: curr.name,
                    size: curr.size
                } as File)
                return acc
        }
    }, root)

var partOneSize = 0
const dirSizes: number[] = []
const getSize: (node: Node | File) => number = node => {
    if ((node as File)?.size !== undefined) {
        return (node as File).size
    } else {
        const size = (node as Node).children.reduce((acc, curr) => acc + getSize(curr), 0)
        if (size <= 100000) {
            partOneSize += size
        }
        dirSizes.push(size)
        return size
    } 
}

const diskSize = 70000000
const updateSize = 30000000

const usedSpace = getSize(root)
const unusedSpace = diskSize - usedSpace

const dirSizeToRemove = dirSizes.filter(a => a >= updateSize - unusedSpace).sort((a, b) => a - b)[0]

console.log(`Part one: ${partOneSize}`)
console.log(`Part two: ${dirSizeToRemove}`)
