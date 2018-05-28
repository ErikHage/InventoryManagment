#!/usr/bin/env node

const exec = require('child_process').exec;
const fs = require('fs');

const order = [
  'statements',
  'branches',
  'functions',
  'lines',
];


const colorOff = '\x1B[0m';

const red = '\x1B[0;31m';
const cyan = '\x1B[0;36m';

const colorize = (color, string) => `${color}${string}${colorOff}`;

fs.readFile('.nycrc', 'utf8', (err, nycConfigJSON) => {
  const nycConfig = JSON.parse(nycConfigJSON);

  exec('npm run coverage', (err, stdout, stderr) => {
    if (err) {
      console.error('Error during nyc report');
      console.log(stderr);
    }

    fs.readFile('spec/coverage/coverage-summary.json', 'utf8', (err, summaryJson) => {
      const summary = JSON.parse(summaryJson);

      const newCoverage = {
        statements: summary.total.statements.pct,
        branches: summary.total.branches.pct,
        functions: summary.total.functions.pct,
        lines: summary.total.lines.pct,
      };

      let changes = '';

      for(let i=0; i<=3; i++) {
        if (newCoverage[order[i]] > nycConfig[order[i]]) {
          // console.log(`Change for ${order[i]}: old=${nycConfig[order[i]]}  new=${newCoverage[order[i]]}`);
          changes = changes + `        - Updating the ${colorize(cyan, order[i])} coverage from ${colorize(cyan, nycConfig[order[i]])} to ${colorize(cyan, newCoverage[order[i]])}\n`;
          nycConfig[order[i]] = newCoverage[order[i]];
        }
      }

      if (changes !== '') {
        fs.writeFile('.nycrc', JSON.stringify(nycConfig, null, 2), (err2) => {
          if (err2) {
            console.error('error during fs.writeFile');
            console.error(err);
            process.exit(1);
          }

          console.error(`\n${colorize(red, '    ACTIONS REQUIRED:')}\n        - Commit the new coverage values and push again.\n\nChanges made:\n${changes}`);
          process.exit(1);
        });
      }
    });
  });
});
