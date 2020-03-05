<template>
  <div>
    <el-input
      id="elInput"
      placeholder="请输入内容"
      v-model="form.input"
    ></el-input>

    <el-date-picker
      end-placeholder="结束月份"
      range-separator="至"
      start-placeholder="开始月份"
      type="monthrange"
      v-model="value1"
    ></el-date-picker>

    <el-select
      placeholder="请选择1"
      v-model="form.value1"
    >
      <el-option
        :key="item.value"
        :label="item.label"
        :value="item.value"
        v-for="item in form.options"
      ></el-option>
    </el-select>

    <el-select
      :remote-method="remoteMethod"
      filterable
      multiple
      placeholder="请输入关键词搜索"
      remote
      reserve-keyword
      v-model="form.value3"
    >
      <el-option
        :key="item.value"
        :label="item.label"
        :value="item.value"
        v-for="item in form.remoteOptions"
      ></el-option>
    </el-select>

    <hr>
    <div>{{ form.input }}</div>
    <div>{{ form.value1 }}</div>
    <div>{{ form.value2 }}</div>
    <div>{{ form.value3 }}</div>

    <hr>

    <button @click="recordStart">开始录制</button>
    <button @click="recordEnd">录制结束</button>
    <button @click="replay">回放</button>
    <div>状态: {{ status }}</div>

    <hr>
    <div class="long"></div>
    <el-select
      placeholder="请选择2"
      v-model="form.value2"
    >
      <el-option
        :key="item.value"
        :label="item.label"
        :value="item.value"
        v-for="item in form.options"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      value1: '',
      form: {
        input: "",
        value1: "",
        value2: "",
        options: [
          {
            value: "选项1",
            label: "黄金糕"
          },
          {
            value: "选项2",
            label: "双皮奶"
          },
          {
            value: "选项3",
            label: "蚵仔煎"
          },
          {
            value: "选项4",
            label: "龙须面"
          },
          {
            value: "选项5",
            label: "北京烤鸭"
          }
        ],
        value3: "",
        remoteOptions: []
      },

      records: [],
      status: "空闲"
    };
  },

  mounted() {
    // setTimeout(() => {
    //   elInput.value = "eee";
    //   elInput.dispatchEvent(new Event("input"))
    //   // console.log(elInput,'elInput')
    // }, 400);
    // this.recordStart();
  },

  methods: {
    // -------------- form --------------
    remoteMethod() {
      // setTimeout(() => {
      this.form.remoteOptions = [
        {
          value: "选项a",
          label: "话梅"
        },
        {
          value: "选项b",
          label: "薯条"
        }
      ];
      // }, 50);
    },
    // -------------- auto-click --------------
    recordFn(e) {
      const { clientX, clientY } = e;
      const { scrollTop, scrollLeft } = document.documentElement;
      console.log(e, "e");
      console.log(e.target, "e.target");
      console.log(e.target.value, "e.target.value");

      switch (e.type) {
        // 点击事件表示新控件
        case "click":
          this.records.push({
            clientX,
            clientY,
            scrollTop,
            scrollLeft,
            e,
            value: e.target.value
          });

          break;

        // 键盘事件表示在控件上输入
        case "keyup":
          _.last(this.records).value = e.target.value;
          break;

        default:
          break;
      }
    },

    recordStart() {
      this.status = "正在录制";
      document.addEventListener("click", this.recordFn, true);
      document.addEventListener("keyup", this.recordFn, true);
    },

    recordEnd() {
      this.status = "录制结束";

      document.removeEventListener("click", this.recordFn, true);

      // 去掉点击'结束录制'按钮的点击操作
      this.records.pop();
      // 记录ui控件的状态
      this.records = this.records.map(record => {
        const target = record.e.target;
        console.dir(target);
        console.log(target.value, "target.value");
        delete record.e;

        return {
          ...record,
          type: this.getUiType(target)
        };
      });

      console.log(this.records, "this.records");

      localStorage.setItem("autoClick", JSON.stringify(this.records));
    },

    getUiType(el) {
      const options = [
        {
          test(el) {
            return el.className.indexOf("el-select__input") > -1;
          },
          getType() {
            return "el-select-input";
          }
        },
        {
          test(el) {
            return el.parentNode.className.indexOf("el-input") > -1;
          },
          getType() {
            return "el-input";
          }
        },
        {
          test(el) {
            return el.parentNode.parentNode.className.indexOf("el-select") > -1;
          },
          getType() {
            return "el-select";
          }
        }
      ];

      let type = "";
      _.forEach(options, ({ test, getType }) => {
        if (test(el)) {
          type = getType();
          return false; // 退出循环
        }
      });

      return type;
    },

    async replay() {
      this.status = "正在回放";

      const records = JSON.parse(localStorage.getItem("autoClick"));
      console.log(records, "records");

      for (const record of records) {
        await this.handleRecord(record);
      }

      this.status = "空闲";
    },

    handleRecord(record) {
      return new Promise((resolve, reject) => {
        const options = [
          {
            test({ type }) {
              return ["el-input", "el-select-input"].includes(type);
            },
            handle({ el, value }) {
              console.log(value, "value");
              console.dir(el);
              // el.focus()
              // el.dispatchEvent(new Event("focus"));
              // el.dispatchEvent(new Event("input"));
              // el.dispatchEvent(new Event("change"));
              el.value = value;
            }
          },
          {
            test({ type }) {
              return type === "el-select";
            },
            handle({ el }) {
              el.click();
            }
          }
        ];

        setTimeout(() => {
          const { scrollTop, scrollLeft, clientX, clientY } = record;

          // 滚动页面
          window.scrollTo(scrollLeft, scrollTop);
          setTimeout(() => {
            // 根据坐标获取元素
            const el = document.elementFromPoint(clientX, clientY);
            record.el = el;

            _.forEach(options, ({ test, handle }) => {
              if (test(record)) {
                handle(record);
                return false;
              }
            });

            resolve();
          }, 500);
        }, 500);
      });
    }
  }
};
</script>

<style scoped>
.long {
  width: 100px;
  height: 1000px;
  background: red;
}
</style>