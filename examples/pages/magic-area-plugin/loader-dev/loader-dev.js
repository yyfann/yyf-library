const path = require('path');
const fs = require('fs');
const loader = require('../../../../src/magic-area-plugin/add-element-location-loader.js');
const source = fs.readFileSync('./index.vue', 'utf-8');

const res = loader(source);

fs.writeFileSync(path.resolve(__dirname, './output.vue'), res);


// let str = `
// <div
//   :listItem="2"
//   @getList="fn"
//   listData="2"
//   :list-item="flag && []"
// ></div>
//     `

// const reg1 = /\s([:@]?)(\w*[A-Z]\w*)="(.*)"\s/g
// str = str.replace(reg1, (...res) => {
//   console.log(res,'res1')
//   const [,type, key, val] = res
//   return ` ${type}${key}="${val}_X_${key}_X_"\n`
// })
// console.log(str,'str1')

// let str = `
// <div
//   :listitem="2_X_listItem_X_"
//   @getlist="fn_X_getList_X_"
//   listdata="2_X_listData_X_"
//   :list-item="flag && []"
// ></div>
//     `
// let str = `
// <div 
// :listitem="2_X_listItem_X_" 
// @getlist="fn_X_getList_X_" 
// @getdata="fetch_X_getData_X_" 
// @getdata2="fetch2_X_getData2_X_" 
// source-code-location="undefined:2:3"></div>
// `
// let str = `
// <div 
// :ab="2_X_aB_X_" @ac="fn_X_aC_X_"
// source-code-location="undefined:2:3"></div>
// `

// const reg2 = /\s?([:@]?)(\w*)="(.*?)_X_(\w*?)_X_"\s/g

// str = str.replace(reg2, (...res) => {
//   console.log(res,'res2')
//   const [,type, key, val, oldKey] = res

//   return ` ${type}${oldKey}="${val}"\n`
// })

// console.log(str,'str2')
