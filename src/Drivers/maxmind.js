'use strict';

const Reader = require('@maxmind/geoip2-node').Reader;
const MissingAdditionException = require("../Exceptions/MissingAdditionException");
const MissingParameterException = require("../Exceptions/MissingParameterException");


const maxmind = (function() {
    let reader,filePath,ipAddress;

     function maxmind(ipAddress, filePath) {
        if (!ipAddress) 
            throw new MissingParameterException(['ipAddress']);
        if(!filePath)
            throw new MissingAdditionException('maxmind','license key');
        this.filePath = filePath;        
        this.ipAddress = ipAddress;
    }

    maxmind.prototype.get = async function() {
        
        let reader = await Reader.open(this.filePath);
        let result = await reader.country(this.ipAddress);
        return {
            'ip': result.traits.ipAddress,
            'country_name': result.registeredCountry.isoCode,
            'country_code': result.registeredCountry.names.en,
        };
    }

    return maxmind;
})();

module.exports = maxmind;