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
          role: ['1', '2'],
          group: [1, 2],
          state: '1',
          startTime1: "2018-8-10 00:00:00",
          endTime1: "2018-8-11 00:00:00",
          startTime3Begin: "2018-8-10 00:00:00",
          startTime3End: "2018-8-11 00:00:00",
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
      const index = 1
      const data = {
        id: index,
        username: `用户${index}`,
        number: index * 10,
        randomTag: Math.random(),
        role: ['1', '2'],
        group: [1, 2],
        state: '1',
        startTime1: "2018-8-10 00:00:00",
        endTime1: "2018-8-11 00:00:00",
        startTime3Begin: "2018-8-10 00:00:00",
        startTime3End: "2018-8-11 00:00:00",
      }

      res.send({
        code: 200,
        data,
      });
    });
  }
}



module.exports = config