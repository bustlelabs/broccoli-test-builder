var Funnel = require('broccoli-funnel');
var ES6 = require('broccoli-babel-transpiler');
var Concat = require('broccoli-concat');
var Merge = require('broccoli-merge-trees');
var amdLoader = require('broccoli-amd-loader');
var testIndexBuilder = require('./test-index');
var ESLint = require('broccoli-lint-eslint');

var path = require('path');

function qunitTree() {
  var qunitDir = path.dirname(require.resolve('qunitjs'));

  return new Funnel(qunitDir, {
    include: [
      'qunit.js',
      'qunit.css',
    ],
    destDir: '/tests/qunit'
  });
}

function emberCLITestLoaderTree() {
  var testLoaderPath = path.join(__dirname, '..', 'ext');
  return new Funnel(testLoaderPath, {
    include: [ 'test-loader.js' ],
    destDir: '/tests/test-loader/'
  });
}

function buildTestTree(options) {
  if (!options) { options = {}; }

  var libDirName = options.libDirName || 'lib';

  var testJSTree = new Funnel('./tests', {
    include: ['**/*.js'],
    destDir: '/tests'
  });

  testJSTree = new ES6(testJSTree, {
    moduleIds: true,
    modules: 'amdStrict'
  });

  testJSTree = new Merge([testJSTree, ESLint(testJSTree)]);

  testJSTree = new Concat(testJSTree, {
    inputFiles: ['**/*.js'],
    outputFile: '/tests/built-amd-tests.js'
  });

  var testExtTree = new Merge([
    qunitTree(),
    emberCLITestLoaderTree()
  ]);

  var testHTMLTree = testIndexBuilder.build('/tests');

  var testTree = new Merge([
    testJSTree,
    testExtTree,
    testHTMLTree
  ]);
  testTree = amdLoader(testTree, {
    destDir: '/tests/loader.js'
  });

  return testTree;
}

module.exports = {
  build: buildTestTree
};
