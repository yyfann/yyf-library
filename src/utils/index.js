const _ = require('lodash')


function join(arr) {
  return _.join(arr, '*')
}


// 替换多个连续空行成一个空行
// tip: 
//  CRLF 的换行模式 \r\n 表示一个换行
//  LF 的换行模式 \n 表示一个换行
// 当前cli中使用的暂时都是 CRLF 模式, 同时注意模版文件的换行方式(见编辑器右下角)
function dropExtraLine(str) {
  return str.replace(/\s+(\r\n)+/g, '\r\n\r\n')
}

/**
 * 在字符串/数组指定位置插入字符/元素
 * @param {Array|string} src - 原数组, 或字符串
 * @param {Object} positionObj - 插入的位置和插入的元素, { 位置: 字符 }
 * @return {Array|string} - 处理后的数组或字符串
 */
function insertByPosition(src, positionObj, options = {}) {
  // 拷贝src成数组
  let srcArr = []
  if (typeof src === 'string') {
    srcArr = src.split('')
  } else if (Array.isArray(src)) {
    srcArr = [...src]
  }

  // 解析positionObj
  const positionArr = Object.entries(positionObj)

  // 插入元素
  positionArr.forEach((x, i) => {
    // tip: 在1号位后面加一个, 实际上是用新元素取代2号位的元素(splice)
    srcArr.splice(+x[0] + 1 + i, 0, x[1])
  })

  // 根据配置输出
  switch (options.resType) {
    case 'array':
      return srcArr
      break
    case 'string':
      return srcArr.join('')
      break
    default:
      return srcArr.join('')
      break
  }
}
/**
 * @param {Array} src - 原数组
 * @return {Array} - 处理后数组
 */
function duplicateHandle(src) {
  const arr = _.cloneDeep(src)
  // 统计每个name出现的次数
  const countRes = _.countBy(arr, 'name')

  // 获得次数 > 1 的name的集合
  const nameArr = _.chain(
    countRes
  ).pickBy((val) => {
    return val > 1
  }).keys().value()

  // 在指定的name的元素上做处理
  arr.forEach((x) => {
    if (nameArr.includes(`${x.name}`)) {
      x.add = x.type
    }
  })

  return arr
}




module.exports = {
  dropExtraLine,
  insertByPosition,
  duplicateHandle,
  join,
}