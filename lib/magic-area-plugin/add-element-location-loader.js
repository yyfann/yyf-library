module.exports = function(source) {
  const { resourcePath } = this;

  function forceTemplate(html) {
    const parse5 = require('parse5');

    const htmlAst = parse5.parseFragment(html, {
      sourceCodeLocationInfo: true
    });

    function addLocation(node) {
      const { sourceCodeLocation } = node;
      if (sourceCodeLocation) {
        const { startLine, startCol } = sourceCodeLocation;
        node.attrs &&
          node.attrs.push({
            name: 'source-code-location',
            value: `${resourcePath}:${startLine}:${startCol}`
          });
      }
    }

    function walk(node) {
      addLocation(node);
      node.childNodes &&
        node.childNodes.forEach(childNode => {
          walk(childNode);
        });
    }

    walk(htmlAst);

    let str = parse5.serialize(htmlAst);

    // -- hack:2 -- parse5解析不到template标签里面的内容, 所以先替换一下
    str = str.replace(/template-x/g, 'template');

    // -- hack:3 解析时误将 & 变成了 &amp; 变回来
    str = str.replace(/&amp;/g, '&');

    // console.log(str,'str in')
    
    // -- hack:3 -- 为了应对parse5将大写的html属性变成小写, 先预先扫描, 将大写的属性key存到val里, 后续再放回去
    const reg2 = /x-([:@]?.*?)-x="(.*?)-x-(.*?)-x"/g;
    str = str.replace(reg2, (...res) => {
      // console.log(res, 'res2');
      const [, ,val, oldKey] = res;
      return ` ${oldKey}="${val}" `;
    });

    // console.log(str,'str out')

    return str;
  }

  let resStr = source.replace(
    /<template([\s\S]*?)>([\s\S]*)<\/template>/,
    (str, str1, str2) => {
      // console.log(str,'str')
      // console.log(str1,'str1')
      // console.log(str2,'str2')
      // -- hack:1 -- 将单标签变成双标签 (parse5对单标签解析异常)
      str2 = str2.replace(/<([\w-]+)([^>^<]*)\/>/g, '<$1$2></$1>');
      str2 = str2.replace(/(<\/br>|<\/img>)/g, '');

      // -- hack:2 -- parse5解析不到template标签里面的内容, 所以先替换一下
      str2 = str2.replace(/<template/g, '<template-x');
      str2 = str2.replace(/<\/template>/g, '</template-x>');

      // -- hack:3 -- 为了应对parse5将大写的html属性变成小写, 先预先扫描, 将大写的属性key存到val里, 后续再放回去
      const reg1 = /\s?([:@]?\w*[A-Z][\w\.]*?)="(.*?)"(\s|>)/g;
      str2 = str2.replace(reg1, (...res) => {
        // console.log(res, 'res1');
        const [, key, val, ending] = res;
        return ` x-${key}-x="${val}-x-${key}-x"${ending}`;
      });

      return `<template${str1}>` + forceTemplate(str2) + '</template>';
    }
  );

  return resStr;
};
