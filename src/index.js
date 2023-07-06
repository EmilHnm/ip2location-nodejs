'use strict';

const ipapi = require("./Drivers/ipapi");
const ip2location = require("./Drivers/ip2location");
const DriverDoesNotExistException = require("./Exceptions/DriverDoesNotExistException");
const MissingParameterException = require("./Exceptions/MissingParameterException");
const maxmind = require("./Drivers/maxmind");

const DRIVER_AVAILABLE = ['IP-API', 'IP2LOCATION','MAXMIND'];

const IpInfo = (function() {
    let ip, driver_index, addition;
    function IpInfo(ip, driver, ...addition) {
        if(!ip || !driver) {
            throw new MissingParameterException(['ip', 'driver'])
        }
        let driver_index = DRIVER_AVAILABLE.findIndex((avaiable) => avaiable == driver.toUpperCase())
        if(driver_index == -1) {
            throw new DriverDoesNotExistException(driver);
        }
        this.ip = ip;
        this.driver_index = driver_index;
        this.additional = addition;
    }
    IpInfo.prototype.get = async function() {
        switch (this.driver_index) {
            case 0: {
                try {
                    let ipapi_driver = new ipapi(this.ip);
                    return  await ipapi_driver.get();
                } catch (error) {
                    throw error;
                }
            }
            case 1: {
                try {
                    return await (new ip2location(this.ip,this.additional[0])).get();
                } catch (error) {
                    throw error;
                }
            }
            case 2: {
                try {
                    let maxmind_driver = new maxmind(this.ip,this.additional[0]);
                    return await maxmind_driver.get();
                } catch (error) {
                    throw error;
                }
            }
            default:
                break;
        }
    }
    return IpInfo;
})()

module.exports = IpInfo;
