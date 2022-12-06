import fs from 'fs'
import path from 'path'

const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', 'input.txt'), 'utf8')
//const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', '1_test_input.txt'), 'utf8')
//const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', '2_test_input.txt'), 'utf8')
//const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', '3_test_input.txt'), 'utf8')
//const fileContent = fs.readFileSync(path.join(__dirname, '..', 'resources', '4_test_input.txt'), 'utf8')

const signal = fileContent.split('')

const token = [...signal.slice(0, 14)]
for (let i = 14; i < signal.length; i++) {
    if (token.length === (new Set(token).size)) {
        console.log(`Part one: ${i}`)
        break;
    }
    token.shift()
    token.push(signal[i])
}

