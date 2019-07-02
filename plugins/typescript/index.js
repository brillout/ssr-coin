const config = require('@brillout/reconfig');

config.ssrCoin.transpileServerCode = true;

config.ssrCoin.typescript = config.ssrCoin.typescript || {};

config.ssrCoin.webpackBrowserConfig = config.ssrCoin.webpackBrowserConfig || [];
config.ssrCoin.webpackBrowserConfig.push(webpackMod);

config.ssrCoin.webpackNodejsConfig = config.ssrCoin.webpackNodejsConfig || [];
config.ssrCoin.webpackNodejsConfig.push(webpackMod);

function webpackMod({config: webpackConfig, getRule, setRule, addExtension, addBabelPreset, addBabelPlugin}) {
  addSyntaxTransforms({webpackConfig, addBabelPreset, addBabelPlugin});

  addTypechecking({webpackConfig});

  addExtensions({webpackConfig, getRule, setRule, addExtension});

  return webpackConfig;
}

function addSyntaxTransforms({webpackConfig, addBabelPreset, addBabelPlugin}) {
  const presetOptions = {
    isTSX: true,
    allExtensions: true,
    ...config.ssrCoin.typescript.babelPresetTypescript,
  };

  addBabelPreset(webpackConfig, [require.resolve('@babel/preset-typescript'), presetOptions]);
  addBabelPlugin(webpackConfig, [require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}]);
  addBabelPlugin(webpackConfig, [require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}]);
}

function addTypechecking({webpackConfig}) {
  if( ! (config.ssrCoin.typescript.forkTsCheckerWebpackPlugin||{}).enable ) {
    return;
  }

  const tsconfig = (config.ssrCoin.typescript.forkTsCheckerWebpackPlugin||{}).tsconfig || get_tsconfig_path(webpackConfig);

  const checkerOptions = {
    silent: true,
    async: false,
    tsconfig,
    ...config.ssrCoin.typescript.forkTsCheckerWebpackPlugin,
  };

  const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
  webpackConfig.plugins = webpackConfig.plugins || [];
  webpackConfig.plugins.push(new ForkTsCheckerWebpackPlugin(checkerOptions));
}

function addExtensions({webpackConfig, getRule, setRule, addExtension}) {
  const jsRule = getRule(webpackConfig, '.js');
  const rule = {...jsRule};
  delete rule.test;
  setRule(webpackConfig, '.ts', rule);
  setRule(webpackConfig, '.tsx', rule);

  addExtension(webpackConfig, '.ts');
  addExtension(webpackConfig, '.tsx');
}

function get_tsconfig_path(webpackConfig) {
  const find_up = require('find-up');
  const assert_usage = require('reassert/usage');

  const userDir = webpackConfig.context || getUserDir();
  const algorithmDesc = 'The "user directory" is determined by the `context` option of the webpack config and if missing then by using `@brillout/project-files`';
  assert_usage(
    userDir,
    'Cannot find `tsconfig.json` because couldn\'t find the "user directory".',
    algorithmDesc
  );
  const tsconfig_path = find_up.sync('tsconfig.json', {cwd: userDir});
  assert_usage(
    tsconfig_path,
    'Cannot find `tsconfig.json` by looking into every directory between the user directory '+userDir+' an the root `/`.',
    algorithmDesc
  );
  return tsconfig_path;
}

function getUserDir() {
  const {userDir} = require('@brillout/project-files');
  return userDir;
}
