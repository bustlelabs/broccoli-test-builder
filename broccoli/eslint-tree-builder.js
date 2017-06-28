var Merge = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var ESLint = require('broccoli-lint-eslint');

function buildESLint(libDirName) {
  var eslintOptions = {
    testGenerator: 'qunit'
  };

  return new Merge(
    [
      ESLint(
        new Funnel(libDirName, {
          include: ['**/*.js'],
          destDir: '/tests/eslint'
        }),
        eslintOptions
      ),
      ESLint(
        new Funnel('./tests', {
          include: ['**/*.js'],
          destDir: '/tests/eslint'
        }),
        eslintOptions
      )
    ]
  );
}

module.exports = {
  build: buildESLint
};
