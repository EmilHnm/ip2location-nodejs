'use strict';

const { IPinfoWrapper } = require("node-ipinfo");
const DriverErrorException = require("../Exceptions/DriverErrorException");

const ipinfo = (function() {
    let ipAddress,ipinfoWrapper;
    function ipinfo(ipAddress) {
        const token = process.env.IPINFO_TOKEN;
        if(token) {
            this.ipinfoWrapper = new IPinfoWrapper(token);
        }
        this.ipAddress = ipAddress;
    }
    ipinfo.prototype.get = async function() {
        if(this.ipinfoWrapper) {
            let result = await this.ipinfoWrapper.lookupIp(this.ipAddress);
            return {
            'ip': result.ip,
            'country_name': result.country,
            'country_code': result.countryCode,
        };
        } 
        let res = await fetch(`https://ipinfo.io/${this.ipAddress}/json`);
        const result = await res.json();
        if (result.status === 404) {
            throw new DriverErrorException('info-api', `${result.error.message} on ${this.ipAddress}`)
        }
        return {
            'ip': result.ip,
            'country_name': result.country,
            'country_code': result.country,
        };
    }
    return ipinfo;
})()

module.exports = ipinfo;