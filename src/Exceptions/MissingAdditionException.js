'use strict';

const MissingAdditionException = (function() {
    function MissingAdditionException(name, type)
        {
            this.error = `'${name}' ${type} is missing`;
            this.message = `'${name}' ${type} is missing`;
        }
    MissingAdditionException.prototype = Object.create(Error.prototype);
    MissingAdditionException.prototype.constructor = MissingAdditionException;

    return MissingAdditionException;
})()

module.exports = MissingAdditionException;