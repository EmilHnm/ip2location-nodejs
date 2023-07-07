'use strict';

const Reader = require('@maxmind/geoip2-node').Reader;
const DriverErrorException = require('../Exceptions/DriverErrorException');
const MissingAdditionException = require("../Exceptions/MissingAdditionException");
const MissingParameterException = require("../Exceptions/MissingParameterException");


const maxmind = (function() {
    let reader,filePath,ipAddress;

     function maxmind(ipAddress) {
        if (!ipAddress) 
            throw new MissingParameterException(['ipAddress']);
        this.filePath = process.env.MINDMAX_FILE;   
        if(!this.filePath)
            throw new MissingAdditionException('maxmind','license key');
        this.ipAddress = ipAddress;
    }

    maxmind.prototype.get = async function() {
        let reader = await Reader.open(this.filePath);
        try {
            let result = await reader.country(this.ipAddress);
        } catch (error) {
            throw new DriverErrorException('maxmind', `${error.message}`)
        }
        
        return {
            'ip': result.traits.ipAddress,
            'country_name': result.registeredCountry.isoCode,
            'country_code': result.registeredCountry.names.en,
        };
    }

    return maxmind;
})();

module.exports = maxmind;