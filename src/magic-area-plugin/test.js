// 这个助手方法下面会用到，用来获取 css 相关属性值
const getAttr = (obj, key) =>
  obj.currentStyle
    ? obj.currentStyle[key]
    : window.getComputedStyle(obj, false)[key];

const vDrag = {
  inserted(el) {
    /**
     * 这里是跟据 dialog 组件的 dom 结构来写的
     * target: dialog 组件的容器元素
     * header：dialog 组件的头部区域，也是就是拖拽的区域
     */
    const target = el.children[0];
    const header = target.children[0];

    // 鼠标手型
    header.style.cursor = "move";
    header.onmousedown = e => {
      // 记录按下时鼠标的坐标和目标元素的 left、top 值
      const currentX = e.clientX;
      const currentY = e.clientY;
      const left = parseInt(getAttr(target, "left"));
      const top = parseInt(getAttr(target, "top"));

      document.onmousemove = event => {
        // 鼠标移动时计算每次移动的距离，并改变拖拽元素的定位
        const disX = event.clientX - currentX;
        const disY = event.clientY - currentY;
        target.style.left = `${left + disX}px`;
        target.style.top = `${top + disY}px`;

        // 阻止事件的默认行为，可以解决选中文本的时候拖不动
        return false
      };

      // 鼠标松开时，拖拽结束
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },

  // 每次重新打开 dialog 时，要将其还原
  update(el) {
    const target = el.children[0];
    target.style.left = "";
    target.style.top = "";
  },

  // 最后卸载时，清除事件绑定
  unbind(el) {
    const header = el.children[0].children[0];
    header.onmousedown = null;
  }
};

export default vDrap;

const getAttr = (obj, key) =>
obj.currentStyle
  ? obj.currentStyle[key]
  : window.getComputedStyle(obj, false)[key];

dragArea.onmousedown = e => {
// 记录按下时鼠标的坐标和目标元素的 left、top 值
const currentX = e.clientX;
const currentY = e.clientY;
const left = parseInt(getAttr(magicArea, "left"));
const top = parseInt(getAttr(magicArea, "top"));

// 分别计算四个方向的边界值
const minLeft = magicArea.offsetLeft + parseInt(getAttr(magicArea, 'width')) - 50;
const maxLeft = parseInt(getAttr(document.body, 'width')) - magicArea.offsetLeft - 50;
const minTop = magicArea.offsetTop;
const maxTop = parseInt(getAttr(document.body, 'height'))
  - magicArea.offsetTop - parseInt(getAttr(dragArea, 'height'));

document.onmousemove = (event) => {
  // 鼠标移动时计算每次移动的距离，并改变拖拽元素的定位
  const disX = event.clientX - currentX;
  const disY = event.clientY - currentY;
  
  // 判断左、右边界
  if (disX < 0 && disX <= -minLeft) {
    magicArea.style.left = `${left - minLeft}px`;
  } else if (disX > 0 && disX >= maxLeft) {
    magicArea.style.left = `${left + maxLeft}px`;
  } else {
    magicArea.style.left = `${left + disX}px`;
  }
  
  // 判断上、下边界
  if (disY < 0 && disY <= -minTop) {
    magicArea.style.top = `${top - minTop}px`;
  } else if (disY > 0 && disY >= maxTop) {
    magicArea.style.top = `${top + maxTop}px`;
  } else {
    magicArea.style.top = `${top + disY}px`;
  }
  return false;
};

// 鼠标松开时，拖拽结束
document.onmouseup = () => {
  document.onmousemove = null;
  document.onmouseup = null;
};
};