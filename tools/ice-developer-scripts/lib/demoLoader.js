module.exports = function(source) {
  if (!source) {
    return '';
  }

  const parsedDemo = parseMarkdown(source);
  const { jsx, css } = parsedDemo.codes;
  return `
;(function(){
  var style = document.createElement('style');
  window.ICE = {
    css: ${JSON.stringify(css)},
    jsx: ${JSON.stringify(jsx)},
    title: ${JSON.stringify(parsedDemo.title)},
    content: ${JSON.stringify(
      parsedDemo.body
        .replace(jsx, '')
        .replace(css, '')
        .replace(/````(jsx|css)?/g, '')
        .replace(/\n+$/g, '')
    )},
  };
  style.innerHTML = window.ICE.css;
  document.head.appendChild(style);

  document.title = window.ICE.title;
})();

${jsx}
  `;
};

const logger = console.log.bind(console);

function parseMarkdown(content) {
  const lines = content.split(/\r\n|\r|\n/);
  const header = [];
  const body = [];
  let recording = true;
  let isYaml = false;

  lines.forEach((line, index) => {
    if (index === 0 && line.slice(0, 3) === '---') {
      isYaml = true;
    }

    if (recording && index && line.slice(0, 3) === '---') {
      recording = false;
    } else if (recording) {
      header.push(line);
    } else {
      body.push(line);
    }
  });

  let bodyStr;
  if (body.length) {
    bodyStr = body.join('\n');
  } else {
    bodyStr = content;
  }

  const codes = parseCodes(bodyStr);

  let meta;
  if (isYaml) {
    meta = {};
    header.forEach((line) => {
      const pair = line.split(':');
      if (pair.length > 1) {
        meta[pair[0].trim()] = pair[1].trim();
      }
    });
  } else {
    throw new Error('meta must be yaml format!');
  }

  if (!meta.title) {
    logger.info('title is missing');
  }
  return {
    title: meta.title,
    meta,
    codes,
    body: bodyStr,
  };
}

/**
 * 解析 jsx/css 信息
 * @param {string} mdString The markdown string
 * @return {object} The code object { jsx, css }
 */
function parseCodes(mdString) {
  const jsxRegex = /````?\s*jsx?\n([\s\S]*?)(<p>)?````?\s*/g; // find jsx codes
  const jsxCodesMatch = jsxRegex.exec(mdString);

  let jsxCodes;
  if (jsxCodesMatch) {
    jsxCodes = jsxCodesMatch[1];
  }

  const cssRegex = /````?\s*css\n([\s\S]*?)````?\s*/g; // find css codes
  const cssCodesMatch = cssRegex.exec(mdString);

  let cssCodes = '';
  if (cssCodesMatch) {
    cssCodes = cssCodesMatch[1] || '';
  }

  return {
    jsx: jsxCodes,
    css: cssCodes,
  };
}
