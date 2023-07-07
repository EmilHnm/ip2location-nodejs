'use strict';

const DriverErrorException = (function() {
    function DriverErrorException(driver, message) { 
        this.error = `Driver '${driver}' Returned An Error`;
        this.message = `Driver '${driver}' Returned An Error With Message '${message}'`;
    }

    DriverErrorException.prototype = Object.create(Error.prototype);
  DriverErrorException.prototype.constructor = DriverErrorException;

    return DriverErrorException;
})();

module.exports = DriverErrorException;