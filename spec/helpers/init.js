require('./chai');
const sinon = require('sinon');

process.env.LOGGING_LEVEL = 'error';

global.sinon = sinon;