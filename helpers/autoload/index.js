const assert = require('reassert');
const {packageJson, packageJsonFile, projectDir} = require('@brillout/project-files');
const findUp = require('find-up');
const path = require('path');

module.exports = {loadDependencies/*, loadFile*/};

/*
function loadFile(filename, opts) {
  const projectFiles = new ProjectFiles();
  const files = projectFiles.findFiles(filename, opts);
  assert.usage(files.length<=1);
  let fileExport;
  files.forEach(filePath => {
    assert.internal(path.isAbsolute(filePath));
    fileExport = require(filePath);
  });
  return {loaded: files, fileExport};
}
*/

function loadDependencies() {
  assert.internal(packageJsonFile);
  assert.internal(projectDir);

  const {dependencies} = packageJson;
  if( !dependencies ) {
    return;
  }

  const loaded = [];
  Object.keys(dependencies)
  .forEach(depName => {
    const dep = require.resolve(depName+'/package.json', {paths: [projectDir]});
    const depPackageJson = eval('require')(dep);
    if( depPackageJson['@brillout/autoload'] ) {
      loaded.push(depName);
      require(depName);
    }
  });

  return {loaded, packageJsonFile};
}
