const config = {
  before: function (app) {
    const child_process = require("child_process");

    // 打开源码
    app.get("/code", function (req, res) {
      child_process.exec(`code ${req.query.filePath}`);
      res.send("文件打开成功!");
    });

    // -------------- mock接口 需要加localhost访问! --------------

    // 列表
    app.get("/mock/list-data", function (req, res) {
      const pageData = Array(10).fill(0).map((x, index) => {
        return {
          id: index,
          name: `物品${index}`,
          number: index * 10,
          randomTag: Math.random()
        }
      })
      console.log(pageData, 'pageData')

      res.send({
        code: 200,
        resultObject: {
          pageData,
        }
      });
    });

    // 详情
    app.get("/mock/single-data", function (req, res) {
      const pageData = {
        id: 1,
        name: `物品${1}`,
        number: 1 * 10,
        randomTag: Math.random()
      }
      console.log(pageData, 'pageData')

      res.send({
        code: 200,
        resultObject: {
          pageData,
        }
      });
    });
  }
};




module.exports = config