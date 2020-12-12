import axios from 'axios';
import _ from 'lodash';
import magicArea from './magic-area.vue';

function magicAreaPlugin(Vue, router, routeDatas, moreConfigs = {}) {
  // -------------- 打开编辑器的函数 --------------
  function launchEditor(filePath) {
    if (!filePath) return;

    console.log(filePath, 'filePath');

    axios.get(`/code`, {
      params: {
        filePath: `-g ${filePath}`
      }
    });
  }

  // 点击元素打开源码 (定位到行列)
  function openSourceCode(e) {
    if (e.ctrlKey) {
      console.log(e.target, 'e.target');

      e.preventDefault();
      // 判断点击元素的类别, 来找不同的标签(含有源码地址的)
      const options = [
        // 标签直接有源码地址
        {
          test(e) {
            return !!e.target.getAttribute('source-code-location');
          },
          getTargetTag(e) {
            return e.target;
          }
        },
        // 2 el-form-item, el-button或任何父级有源码地址的标签
        {
          test(e) {
            return !!e.target.parentNode.getAttribute('source-code-location');
          },
          getTargetTag(e) {
            return e.target.parentNode;
          }
        },
        // 3 el-select或任何爷级有源码地址的标签
        {
          test(e) {
            return !!e.target.parentNode.parentNode.getAttribute(
              'source-code-location'
            );
          },
          getTargetTag(e) {
            return e.target.parentNode.parentNode;
          }
        },
        // 1 el-table 的表头, 单元格
        {
          test(e) {
            return (
              _.get(e.target, 'parentNode.className', '').indexOf('el-table') >
                -1 || _.get(e.target, 'className', '').indexOf('el-table') > -1
            );
          },
          getTargetTag(e) {
            /**
             * el-table,el-table-column 处理 (支持多级表头)
             */

            let elColumn;

            if (
              [e.target.localName, e.target.parentNode.localName].includes('th')
            ) {
              // -------------- 点击表头的处理
              /**
               * 将hiddenColumns格式化为二维数组,
               *   const hiddens = [
                    { loc: 0 },
                    { loc: 1, children: [{ loc: 2 }] },
                    { loc: 4, children: [{ loc: 5 }, { loc: 6 }] }
                  ];
                  -->
                  hiddensFormat = [
                    [0,1,4],
                    [2,5,6],
                  ]
  
                  正好点击元素可以通过他的 trIndex, thIndex 在hiddensFormat 中找到对应的 el-table-column : hiddensFormat[trIndex][thIndex]
               */
              const th =
                e.target.className === 'cell' ? e.target.parentNode : e.target;

              const tr = th.parentNode;
              const thIndex = Array.from(tr.children).indexOf(th);
              const trIndex = Array.from(tr.parentNode.children).indexOf(tr);

              const elTable = tr.parentNode.parentNode.parentNode.parentNode;
              const hiddenColumns = Array.from(elTable.children).find(
                child => child.className === 'hidden-columns'
              ).children;

              function getLevelNodes(src) {
                let tree;
                if (_.isArrayLike(src)) {
                  tree = {
                    name: 'root',
                    children: src
                  };
                } else {
                  tree = src;
                }

                let mountain = [];
                function walk(node, level) {
                  level = level || 1;
                  mountain[level - 1] = mountain[level - 1] || [];
                  mountain[level - 1].push(node);
                  if (node.children) {
                    Array.from(node.children).forEach(child => {
                      walk(child, level + 1);
                    });
                  }
                }
                walk(tree);

                if (_.isArrayLike(src)) {
                  mountain.shift();
                }

                return mountain;
              }

              const hiddenColumnsLevelNodes = getLevelNodes(hiddenColumns);

              elColumn = hiddenColumnsLevelNodes[trIndex][thIndex];
            } else {
              // -------------- 点击单元格的处理
              /**
               * 获取 hiddenColumns 末端节点(没有children), 其长度就是单元格的列数
               * 目标元素的通过 tdIndex 在末端节点离中可以找到对应的 el-table-column
               */
              const td =
                e.target.className === 'cell' ? e.target.parentNode : e.target;

              const tr = td.parentNode;
              const tdIndex = Array.from(tr.children).indexOf(td);

              const elTable = tr.parentNode.parentNode.parentNode.parentNode;
              const hiddenColumns = Array.from(elTable.children).find(
                child => child.className === 'hidden-columns'
              ).children;

              function getEndNodes(src) {
                let tree;
                if (_.isArrayLike(src)) {
                  tree = {
                    name: 'root',
                    children: src
                  };
                } else {
                  tree = src;
                }


                let mountain = [];
                function walk(node) {
                  if (!node.children.length) {
                    mountain.push(node);
                  } else {
                    Array.from(node.children).forEach(child => {
                      walk(child);
                    });
                  }
                }
                walk(tree);

                return mountain;
              }

              const hiddenColumnsEndNodes = getEndNodes(hiddenColumns);
              elColumn = hiddenColumnsEndNodes[tdIndex];
            }

            return elColumn;
          }
        }
      ];

      // 找到标签
      let targetTag = null;
      _.forEach(options, ({ test, getTargetTag }) => {
        if (test(e)) {
          targetTag = getTargetTag(e);
          return false; // 退出循环
        }
      });


      // 跳转源码
      const filePath = targetTag.getAttribute('source-code-location');
      launchEditor(filePath);
    }
  }
  document.addEventListener('click', openSourceCode);
  document.addEventListener('contextmenu', openSourceCode);

  // -------------- 操作面板实例 --------------
  const magicAreaEl = document.createElement('div');
  magicAreaEl.id = 'magicAreaEl';
  document.body.appendChild(magicAreaEl);

  if (!this.constructor.instance) {
    this.constructor.instance = new Vue({
      el: '#magicAreaEl',
      components: {
        magicArea
      },
      data: {
        magicProps: {
          routeDatas,
          ...moreConfigs
        }
      },
      template: `
      <magic-area 
        v-bind="magicProps"
      />
    `,
      router
    });
  }

  // 点击打开组件级别的源码 (优先打开node_modules里面的, 没有则回退到项目的组件)
  const openComponentPlugin = {
    install(Vue, options) {
      Vue.mixin({
        mounted() {
          this.__injectedFn = e => {
            if (e.altKey) {
              e.preventDefault();
              let filePath = this.$options.__file;

              const { inspectUiLibrary } = moreConfigs;

              if (filePath) {
                if (_.startsWith(filePath, 'packages')) {
                  if (inspectUiLibrary) {
                    e.stopPropagation();
                    filePath = `node_modules/${inspectUiLibrary}/${filePath}`;
                    launchEditor(filePath);
                  }
                } else {
                  e.stopPropagation();
                  launchEditor(filePath);
                }
              }
            }
          };
          this.$el.addEventListener('click', this.__injectedFn);
        },

        destroyed() {
          this.$el.removeEventListener('click', this.__injectedFn);
        }
      });
    }
  };
  Vue.use(openComponentPlugin);
}

export default magicAreaPlugin;
