const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const hotDevClientPath = require.resolve('react-dev-utils/webpackHotDevClient');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const getPaths = require('ice-scripts/lib/config/paths');
const getWebpackConfigDev = require('ice-scripts/lib/config/webpack.config.dev');
const getDevServerConfig = require('ice-scripts/lib/config/webpack.server.config');
const chalk = require('chalk');
const ejs = require('ejs');

const DEFAULT_PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || '0.0.0.0';
const cwd = process.cwd();
const demoTemplate = ejs.compile(
  fs.readFileSync(path.join(__dirname, './demo.ejs'), 'utf-8')
);

choosePort(HOST, parseInt(DEFAULT_PORT, 10))
  .then((port) => {
    if (port == null) {
      // We have not found a port.
      process.exit(500);
    }
    return port;
  })
  .then((PORT) => {
    const isInteractive = false; // process.stdout.isTTY;
    const pkg = require(path.join(cwd, 'package.json'));
    const paths = getPaths(cwd);

    const entries = {};
    const demos = fs
      .readdirSync(path.join(cwd, 'demo'))
      .filter((file) => /\.md$/.test(file));
    demos.forEach((file) => {
      const { name } = path.parse(file);
      entries[name] = [
        hotDevClientPath,
        require.resolve(path.join(cwd, 'demo', file)),
      ];
    });

    const webpackConfig = getWebpackConfigDev(
      entries,
      paths,
      pkg.blockConfig || {}
    );
    webpackConfig.resolve = webpackConfig.resolve || {};
    webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
    webpackConfig.resolve.alias[pkg.name] = path.resolve(cwd, 'src/index');

    const devServerConfig = getDevServerConfig(paths, {
      devType: 'component',
    });
    devServerConfig.before = function(app) {
      app.get('/demo/:demoName', function(req, res) {
        const { name } = path.parse(req.params.demoName);
        res.setHeader('Content-Type', 'text/html');
        res.end(
          demoTemplate({
            jsx: '',
            css: '',
            demoName: name,
            demoList: demos,
          })
        );
      });
    };
    const jsLoader = webpackConfig.module.rules.find((rule) =>
      rule.test.source.match('js')
    );
    webpackConfig.module.rules.push({
      test: /\.md$/,
      use: [
        {
          loader: jsLoader.loader,
          options: jsLoader.options,
        },
        require.resolve('./demoLoader'),
      ],
    });

    webpackConfig.plugins = webpackConfig.plugins.filter((plugin) => {
      return plugin.constructor.name !== 'HtmlWebpackPlugin';
    });

    const compiler = webpack(webpackConfig);

    const devServer = new WebpackDevServer(compiler, devServerConfig);
    let isFirstCompile = true;

    compiler.plugin('done', (stats) => {
      if (isInteractive) {
        clearConsole();
      }
      if (isFirstCompile) {
        isFirstCompile = false;
        console.log(chalk.cyan('Starting the development server...'));
        console.log(
          '   ',
          chalk.yellow(`http://${HOST}:${PORT}/demo/index.html`)
        );
      }

      console.log(
        stats.toString({
          colors: true,
          chunks: false,
          assets: true,
          children: false,
          modules: false,
        })
      );

      const json = stats.toJson({}, true);
      const messages = formatWebpackMessages(json);
      const isSuccessful = !messages.errors.length && !messages.warnings.length;

      if (isSuccessful) {
        if (stats.stats) {
          console.log(chalk.green('Compiled successfully'));
        } else {
          console.log(
            chalk.green(
              `Compiled successfully in ${(json.time / 1000).toFixed(1)}s!`
            )
          );
        }
      }

      if (messages.errors.length) {
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        console.log(chalk.red('Failed to compile.\n'));
        console.log(messages.errors.join('\n\n'));
      } else if (messages.warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.'));
        console.log();
        messages.warnings.forEach((message) => {
          console.log(message);
          console.log();
        });
        // Teach some ESLint tricks.
        console.log('You may use special comments to disable some warnings.');
        console.log(
          `Use ${chalk.yellow(
            '// eslint-disable-next-line'
          )} to ignore the next line.`
        );
        console.log(
          `Use ${chalk.yellow(
            '/* eslint-disable */'
          )} to ignore all warnings in a file.`
        );
        console.log();
      }

      if (isSuccessful) {
        // 服务启动完成, 没有任务错误与警告
      } else {
        // 服务启动完成, 有任务错误与警告
      }
    });

    compiler.plugin('invalid', () => {
      if (isInteractive) {
        clearConsole();
      }
      console.log('Compiling...');
    });

    devServer.use(function(req, res, next) {
      console.log('Time:', Date.now());
      next();
    });

    devServer.listen(PORT, HOST, (err) => {
      // 端口被占用，退出程序
      if (err) {
        console.error(err);
        process.exit(500);
      } else {
        console.log(`dev server at ${HOST}:${PORT}`);
      }
    });
  });

/**
 * 生成 demo 预览的 html
 */
function templateHTML() {}
