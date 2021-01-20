const prettier = require("prettier");
const fs = require('fs')
const obj = {
  name: {
    age: 1
  },
  name1: {
    age: 1
  },
  name2: {
    age: 2354234234324
  },
};

const code = JSON.stringify(obj);
console.log(code,'code')
const res = prettier.format(code, {
// const res = prettier.format(`code}`, {
  parser: 'json'
})
fs.writeFileSync('./temp.js', res)
console.log(res,'res')
