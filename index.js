const express = require('express');
const requestIp = require('request-ip');

const app = express ();
app.use(express.json());

const {IP2Location} = require("ip2location-nodejs");
const {json} = require("express");

let ip2location = new IP2Location();

ip2location.open("./IP2LOCATION-LITE.BIN");

app.get('/', (request, response) => {
    const ipAddress = requestIp.getClientIp(request);

    let result = ip2location.getAll(ipAddress);

    return response.json({
        'ip': result.ip,
        'country_name': result.countryLong,
        'country_code': result.countryShort,
    })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});