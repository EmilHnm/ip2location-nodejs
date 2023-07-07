'use strict'
const MissingParameterException = require("../Exceptions/MissingParameterException");
const DriverErrorException = require("../Exceptions/DriverErrorException");

const fields = ['status','message','country','countryCode','query']

const ipapi = (function() {
    let ipAddress;

    function ipapi(ipAddress) {
        this.ipAddress = ipAddress;
    }

    ipapi.prototype.get = async function() {
        if (!this.ipAddress) {
            throw new MissingParameterException(['ipAddress']);
        }
        const url = `http://ip-api.com/json/${this.ipAddress}?fields=${fields.join(',')}`;
        const res = await fetch(url);
        const data = await res.json();
        if(data.status === 'fail') {
            throw new DriverErrorException('ip-api', `${data.message} on ${data.query}`)
        }
        return {
            'ip': data.query,
            'country_name': data.country,
            'country_code': data.countryCode
        };
    };

    return ipapi;
})();

module.exports = ipapi;