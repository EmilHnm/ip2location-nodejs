'use strict';

const ipapi = require("./Drivers/ipapi");
const ip2location = require("./Drivers/ip2location");
const DriverDoesNotExistException = require("./Exceptions/DriverDoesNotExistException");
const MissingParameterException = require("./Exceptions/MissingParameterException");
const maxmind = require("./Drivers/maxmind");
const ipinfo = require("./Drivers/ipinfo");

const DRIVER_AVAILABLE = ['IP-API', 'IP2LOCATION','MAXMIND', 'IPINFO'];

const IpInformation = (function() {
    let ip, driver_index, addition, retry;
    function IpInformation(ip, driver) {
        if(!ip) {
            throw new MissingParameterException(['ip'])
        }
        let driver_index = DRIVER_AVAILABLE.findIndex((avaiable) => avaiable == driver.toUpperCase())
        if(driver_index == -1) {
            throw new DriverDoesNotExistException(driver);
        }
        this.ip = ip;
        this.driver_index = driver_index;
    }
    IpInformation.prototype.retry = false;
    IpInformation.prototype.get = async function() {
        let remaining = [...DRIVER_AVAILABLE];
        do {
            switch (this.driver_index) {
                case 0: {
                    try {
                        let ipapi_driver = new ipapi(this.ip);
                        return  await ipapi_driver.get();
                    } catch (error) {
                        
                        if(!this.retry){
                            throw error;
                        }
                        else {
                            remaining = remaining.filter((driver) => driver != DRIVER_AVAILABLE[this.driver_index]);
                            this.driver_index = DRIVER_AVAILABLE.findIndex((driver) => driver == remaining[0]);
                        }
                    }
                }
                case 1: {
                    try {
                        let ip2location_driver = new ip2location(this.ip)
                        return ip2location_driver.get();
                    } catch (error) {
                        if(!this.retry)
                            throw error;
                        else {
                            remaining = remaining.filter((driver) => driver != DRIVER_AVAILABLE[this.driver_index]);
                            this.driver_index = DRIVER_AVAILABLE.findIndex((driver) => driver == remaining[0]);
                        }
                    }
                }
                case 2: {
                    try {
                        let maxmind_driver = new maxmind(this.ip);
                        return await maxmind_driver.get();
                    } catch (error) {
                        if(!this.retry)
                            throw error;
                        else {
                            remaining = remaining.filter((driver) => driver != DRIVER_AVAILABLE[this.driver_index]);
                            this.driver_index = DRIVER_AVAILABLE.findIndex((driver) => driver == remaining[0]);
                        }
                    }
                }
                case 3: {
                    try {
                        let ipinfo_driver = new ipinfo(this.ip);
                        return await ipinfo_driver.get();
                    } catch (error) {
                        if(!this.retry)
                            throw error;
                        else {
                            remaining = remaining.filter((driver) => driver != DRIVER_AVAILABLE[this.driver_index]);
                            this.driver_index = DRIVER_AVAILABLE.findIndex((driver) => driver == remaining[0]);
                        }
                    }
                }
                default:
                    throw new Error('All driver errored');
            }
           
        } while (remaining.length != 0 && this.retry === true);
    }
    return IpInformation;
})()

module.exports = IpInformation;
