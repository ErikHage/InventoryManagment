const Errr = require('errr');

const errorUtils = require('./error-utils');
const errorMessages = require('./errors.json');

const DEFAULT_PROPS = {
  source: 'inventory-management',
};

const getErrorFromCode = (code, debugParams, appendedError) => {
  const errorDetails = errorMessages[code];
  if (!errorDetails) {
    throw new Error('[ERROR_FACTORY] invalid error code passed in');
  }

  const { message } = errorDetails;
  const props = Object.assign({}, DEFAULT_PROPS, errorDetails);

  if (!props.status) {
    if (appendedError && appendedError.status) {
      props.status = appendedError.status;
    } else {
      props.status = 500;
    }
  }

  let errBuilder = Errr.newError(message)
    .setAll(props, true)
    .set('code', code, true);

  if (debugParams) {
    errBuilder = errBuilder.debug(debugParams);
  }

  const error = errBuilder.get();

  Object.defineProperty(error, 'causedBy', {
    enumerable: false,
    writable: false,
    configurable: true,
    value: appendedError,
  });

  error.toObject = () => {
    const errors = [];

    let currentError = error;
    while (currentError) {
      errors.push(errorUtils.filter(currentError));
      currentError = currentError.causedBy;
    }

    return { errors };
  };

  error.toJSON = () => JSON.stringify(error.toObject());

  return error;
};

module.exports = {
  getErrorFromCode,
};
