/* eslint no-shadow:0 */
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const write = require('write');
const glob = require('glob');
const prettierFormat = require('./prettierFormat');

const cwd = process.cwd();
const sourceDirPath = path.join(cwd, 'templates');

/**
 * Layout 生成入口
 * @param {Object} layoutConfig
 */
module.exports = function generatorLayout(layoutConfig = {}) {
  return new Promise((resolve, reject) => {
    // 默认需要生成的组件
    const defaultComponents = ['Logo', 'layouts'];

    // 用户选择的布局组件
    const layoutComponents = [];
    Object.keys(layoutConfig).forEach((key) => {
      if (['header', 'aside', 'footer'].indexOf(key) !== -1) {
        if (!layoutConfig[key].enabled) {
          layoutConfig[key] = null; // 将未选择的元素的值设置为 null
        } else {
          layoutComponents.push(upperCase(key));
        }
      }
    });

    // 字段补充合并用于查找对应的组件
    layoutConfig = Object.assign({}, layoutConfig, {
      layoutComponents: layoutComponents.concat(defaultComponents),
    });

    // layout 生成目录
    let destDirPath;
    if (layoutConfig.directory) {
      destDirPath = path.join(layoutConfig.directory, layoutConfig.name);
    } else {
      // 用于测试使用
      destDirPath = path.join(__dirname, 'app/src/layouts', layoutConfig.name);
    }

    // 判断新添加的布局名是否已经存在
    if (fs.existsSync(destDirPath)) {
      rimraf.sync(destDirPath);
      mkdirp.sync(destDirPath);
      // throw new Error('已存在同名的 Layout，请重新自定义 Layout 名称');
    } else {
      mkdirp.sync(destDirPath);
    }

    return renderDirFiles(sourceDirPath, destDirPath, layoutConfig)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 将一个目录下的所有文件遍历渲染
 * @param  {Strign} sourceDirPath  模板所在目录一个临时文件夹
 * @param  {String} destDirPath   目标文件夹
 * @param  {Object} data          数据，使用 ejs 渲染
 * @return {Promise}
 */
function renderDirFiles(sourceDirPath, destDirPath, data) {
  const defaultData = {};

  data = Object.assign({}, defaultData, data);

  return new Promise((resolve, reject) => {
    glob(
      '**/*',
      {
        cwd: sourceDirPath,
        nodir: true,
        dot: true,
      },
      (err, files) => {
        if (err) {
          return reject(err);
        }

        const queue = files.map((file) => {
          const fileArr = file.split('/');
          data.layoutComponents.forEach((fileName) => {
            if (fileArr.indexOf(fileName) === -1) return;

            const sourceFileAbsolutePath = path.resolve(sourceDirPath, file);
            // component 下载到对应项目的 src/layout/xxxLayout 目录下
            // layout 下载到对应项目的 src/layout/xxxLayout 目录下
            let destFileAbsolutePath;
            if (file.startsWith('components')) {
              destFileAbsolutePath = path.join(destDirPath, file);
            } else if (file.startsWith('layouts')) {
              let basename = path.basename(file);
              if (/\.jsx?$/.test(basename)) {
                if (/\.jsx$/.test(basename)) {
                  basename = basename.replace(basename, `${data.name}.jsx`);
                }
                destFileAbsolutePath = path.resolve(destDirPath, basename);
              } else {
                destFileAbsolutePath = path.resolve(
                  destDirPath,
                  `scss/${basename}`
                );
              }
            } else {
              console.log(chalk.red('未匹配到的文件'));
            }

            return renderTemplateFile(
              sourceFileAbsolutePath,
              destFileAbsolutePath,
              data
            );
          });
        });

        Promise.all(queue)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            console.log(chalk.red(err));
            reject(err);
          });
      }
    );
  });
}

/**
 * 将一个文件的模板内容进行渲染
 *
 * @param {String} sourceFile
 * @param {String} filePath
 * @param {Object} data 模板对应数据
 * @return {Promise}
 */
function renderTemplateFile(sourceFile, filePath, data) {
  return new Promise((resolve, reject) => {
    fs.readFile(sourceFile, 'utf-8', (err, content) => {
      if (err) {
        return reject(err);
      }

      let renderedContent;
      renderedContent = ejs.render(content, data);

      const extname = path.extname(sourceFile);
      renderedContent = prettierFormat(renderedContent, {
        parser: /\.jsx?/i.test(extname) ? 'babylon' : 'scss',
      });

      write(filePath, renderedContent, (err) => {
        if (err) {
          return reject(err);
        }

        // console.log(
        //   chalk.green('  created  ', `${data.name}/${path.basename(filePath)}`)
        // );

        resolve();
      });
    });
  });
}

function upperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}
