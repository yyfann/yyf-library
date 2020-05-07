describe('常用函数', () => {
  test('insertByPosition 数组插入元素', () => {
    const {insertByPosition} = require('../../src/utils/index')
    console.log(insertByPosition,'insertByPosition')
    const arr = [1, 2, 3]
    const res = insertByPosition(arr, {
      1: 'a',
      2: 'b',
    })
    console.log(res, 'res')
    expect(res).toBe('12a3b')
  })
});