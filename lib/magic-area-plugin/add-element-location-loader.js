module.exports = function (source) {
  const templateSrc = source

  const { resourcePath } = this

  const getForcedTemplate = (content, callback) => {
    return content.replace(/<template[\\s\\S]*>([\s\S]*)<\/template>/, (str, str1) => {
      return '<template>' + callback(str1) + '<\/template>';
    });
  }
  
  function forceTemplate(html) {
    const parse5 = require('parse5');
  
    const htmlAst = parse5.parseFragment(html, {
      sourceCodeLocationInfo: true,
    });
  
    function addLocation(node) {
      const { sourceCodeLocation } = node
      if (sourceCodeLocation) {
        const { startLine, startCol } = sourceCodeLocation
        node.attrs && node.attrs.push({
          name: 'source-code-location',
          value: `${resourcePath}:${startLine}:${startCol}`
        })
      }
    }
  
    function walk(node) {
      addLocation(node)
      node.childNodes && node.childNodes.forEach((childNode) => {
        walk(childNode)
      })
    }
  
    walk(htmlAst)
  
    const str = parse5.serialize(htmlAst);
  
    return str
  }
  
  const res = getForcedTemplate(templateSrc, forceTemplate)
  return res
}








