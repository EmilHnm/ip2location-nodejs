'use strict';

const ipapi = require("./Drivers/ipapi");
const ip2location = require("./Drivers/ip2location");
const DriverDoesNotExistException = require("./Exceptions/DriverDoesNotExistException");
const MissingParameterException = require("./Exceptions/MissingParameterException");
const maxmind = require("./Drivers/maxmind");
const ipinfo = require("./Drivers/ipinfo");

const DRIVER_AVAILABLE = ['IP-API', 'IP2LOCATION', 'MAXMIND', 'IPINFO'];

const IpInformation = (function () {
    let ip, driverIndex, addition, retry;
    function IpInformation(ip, driver) {
        if (!ip) {
            throw new MissingParameterException(['ip'])
        }
        let driverIndex = DRIVER_AVAILABLE.findIndex((avaiable) => avaiable == driver.toUpperCase())
        if (driverIndex == -1) {
            throw new DriverDoesNotExistException(driver);
        }
        this.ip = ip;
        this.driverIndex = driverIndex;
    }
    IpInformation.prototype.retry = false;
    IpInformation.prototype.get = async function () {
        let remaining = [...DRIVER_AVAILABLE];
        do {
            try {
                let data;
                switch (this.driverIndex) {
                    case 0:
                        {
                            const ipapiDriver = new ipapi(this.ip);
                            data = await ipapiDriver.get();
                            break;
                        }
                    case 1:
                        {
                            const ip2locationDriver = new ip2location(this.ip);
                            data = await ip2locationDriver.get();
                            break;
                        }
                    case 2:
                        {
                            const maxmindDriver = new maxmind(this.ip);
                            data = await maxmindDriver.get();
                            break;
                        }
                    case 3:
                        {
                            const ipinfoDriver = new ipinfo(this.ip);
                            data = await ipinfoDriver.get();
                            break;
                        }
                    default:
                        throw new Error('All drivers errored');
                }
                return data;
            } catch (error) {
                if (!this.retry) {
                    throw error;
                } else {
                    remaining = remaining.filter((driver) => driver !== DRIVER_AVAILABLE[this.driverIndex]);
                    this.driverIndex = DRIVER_AVAILABLE.findIndex((driver) => driver === remaining[0]);
                }
            }
        } while (remaining.length !== 0 && this.retry === true);
    }
    return IpInformation;
})()

module.exports = IpInformation;
