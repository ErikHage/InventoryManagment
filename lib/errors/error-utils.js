/* eslint-disable no-prototype-builtins */
const constants = require('../helper/constants');

const filter = (err, props) => {
  props = props || constants.errorFields; // eslint-disable-line no-param-reassign

  if (!(typeof err === 'object' && err)) {
    throw new TypeError(`Function parameter expects 'object' but was ${typeof err}`);
  }

  const resp = {};

  props.forEach((prop) => {
    if (err.hasOwnProperty(prop)) {
      resp[prop] = err[prop];
    }
  });

  return resp;
};

module.exports = {
  filter,
};
