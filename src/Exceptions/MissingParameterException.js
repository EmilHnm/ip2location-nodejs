'use strict';

const MissingParameterException = (function() {
    function MissingParameterException(arrayParameters)
        {
            this.error = `'${arrayParameters.join("','")}' Are Required`;
            this.message = `'${arrayParameters.join("','")}' Are Required`;
        }
    MissingParameterException.prototype = Object.create(Error.prototype);
    MissingParameterException.prototype.constructor = MissingParameterException;

    return MissingParameterException;
})()

module.exports = MissingParameterException;