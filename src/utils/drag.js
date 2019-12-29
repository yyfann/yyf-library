
/**
 * 拖拽函数
 * @param {HTMLElement} box 被拖拽的元素
 * @param {HTMLElement} dragArea 拖拽的触发区域
 * @param {Boolean} config.savePosition 是否将位置保存在localStorage中
 */
function drag(box, dragArea, config={}) {
  const { savePosition } = config
  const localStorageKey = 'yyf-library-drag-position'

  if (savePosition) {
    const oldPosition = JSON.parse(localStorage.getItem(localStorageKey))
    Object.assign(box.style, oldPosition)
  }
  
  dragArea.onmousedown = function(e) {
    var a = e.clientX - dragArea.getBoundingClientRect().left
    var b = e.clientY - dragArea.getBoundingClientRect().top
    
    document.onmousemove = function(e) {
      var x = e.clientX - a - dragArea.offsetLeft;
      var y = e.clientY - b - dragArea.offsetTop;
      var h = document.documentElement.clientHeight;
      var w = document.documentElement.clientWidth;

      var xmax = w - box.offsetWidth;
      var ymax = h - box.offsetHeight;
      //判断边界
      if (x < 0) {
        x = 0;
      } else if (x > xmax) {
        x = xmax;
      }
      if (y < 0) {
        y = 0;
      } else if (y > ymax) {
        y = ymax;
      }

      box.style.left = x + "px";
      box.style.top = y + "px";

      return false;
    };
  };
  document.documentElement.onmouseup = function() {
    if (savePosition) {
      const { left, top } = box.style
      localStorage.setItem(localStorageKey, JSON.stringify({
        left,top
      }))
    }

    document.onmousemove = null;
  };
}


export {drag}
