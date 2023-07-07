'use strict';
const {IP2Location} = require("ip2location-nodejs");
const MissingAdditionException = require("../Exceptions/MissingAdditionException");
const DriverErrorException = require("../Exceptions/DriverErrorException");


const ip2location = (function() {
    let ipAddress, filePath;
    function ip2location(ipAddress) {
        this.ipAddress = ipAddress;
        this.filePath = process.env.IP2LOCATION_FILE;
        if(!this.filePath)
            throw new MissingAdditionException('ip2location','file')
        
    }
    ip2location.prototype.get = async function() {
        let ip2location = new IP2Location();
        ip2location.open(this.filePath);
        let result = await ip2location.getAll(this.ipAddress);
        if(result.ip == '?') {
            throw new DriverErrorException('ip2location', `${result.countryShort} on ${this.ipAddress}`);
        }
        return {
            'ip': result.ip,
            'country_name': result.countryLong,
            'country_code': result.countryShort,
        };
    }

    return ip2location;
})()

module.exports = ip2location;