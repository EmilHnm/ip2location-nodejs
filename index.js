const express = require('express');
const requestIp = require('request-ip');
const {IP2Location} = require("ip2location-nodejs");

const app = express();
app.use(express.json());

let ip2location = new IP2Location();

ip2location.open("./IP2LOCATION-LITE.BIN");

app.get('/', (request, response) => {
    let ipAddress = requestIp.getClientIp(request);
    response.send("Hello, " + ipAddress);
});

app.get('/ip2location', (request, response) => {
    let ipAddress = requestIp.getClientIp(request);

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