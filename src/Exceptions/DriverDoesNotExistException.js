'use strict';

const DriverDoesNotExistException = (function() {
  function DriverDoesNotExistException(driver) {
    this.error = `Driver '${driver}' Is Not Supported`;
    this.message = `Driver '${driver}' Is Not Supported`;
  }
  
  DriverDoesNotExistException.prototype = Object.create(Error.prototype);
  DriverDoesNotExistException.prototype.constructor = DriverDoesNotExistException;

  return DriverDoesNotExistException;
})();

module.exports = DriverDoesNotExistException;
