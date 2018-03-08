// 获取项目类型,
// project | block | layout | component | unknown
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

module.exports = () => {
  const packagePath = path.join(cwd, 'package.json');
  const package = require(packagePath);
  if ('blockConfig' in package) {
    if (
      Array.isArray(package.blockConfig.categories) &&
      package.blockConfig.categories.some((cat) => cat === 'layout')
    ) {
      return 'layout';
    }
    return 'block';
  }

  if ('ice' in package && package.ice.projectName) {
    return 'project';
  }

  if (
    'componentConfig' in package ||
    (Array.isArray(package.keywords) &&
      package.keywords.some((key) => key === 'ice-component'))
  ) {
    return 'component';
  }
  return 'unknown';
};
