module.exports = function(config) {
  config.set({
    files: [
          // Add your files here, this is just an example:
          'utilities/**/*.test.js',
          {pattern: 'utilities/*.js', mutated: true, included: false},
          {pattern: 'utilities/**/*.test.js', mutated: false, included: false}

        ],
        mutator: 'javascript',
        testRunner: 'mocha',
        reporter: ['html', 'progress'],
        coverageAnalysis: 'all',
        plugins: ['stryker-mocha-runner', 'stryker-html-reporter', 'stryker-javascript-mutator']
      });
};
