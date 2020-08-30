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
    app.get("/mock/list", function (req, res) {
      const data = Array(10).fill(0).map((x, index) => {
        return {
          id: index,
          username: `用户${index}`,
          number: index * 10,
          randomTag: Math.random(),
          role: [1, 2],
          group: [1, 2],
          state: 1,
        }
      })

      res.send({
        code: 200,
        data,
      });
    });

    app.get("/mock/list-group", function (req, res) {
      const data = Array(10).fill(0).map((x, index) => {
        return {
          id: index,
          name: `小组${index}`,
        }
      })

      res.send({
        code: 200,
        data,
      });
    });

    // 详情
    app.get("/mock/detail", function (req, res) {
      const data = {
        id: 1,
        username: `用户${1}`,
        number: 1 * 10,
        randomTag: Math.random()
      }

      res.send({
        code: 200,
        data,
      });
    });
  }
}



module.exports = config