const express = require('express');
const IpInformation = require('./src');

const app = express();
app.use(express.json());
app.set('trust proxy', true);

app.get('/', (request, response) => {
    let ipAddress = request.ip;
    response.send("Hello, " + ipAddress);
});

app.get('/:driver', (request, response) => {
    let ipAddress = request.query.ip ?? request.ip;
    let driver = request.params.driver;
    addition = null;
    if (driver.toLocaleLowerCase() === 'maxmind') {
        addition = './GeoLite2-Country.mmdb';
    }
    if(driver.toLocaleLowerCase() === 'ip2location') {
        addition = './IP2LOCATION-LITE.BIN';
    }
    if(driver.toLocaleLowerCase() === 'ipinfo') {
        addition = request.query.ipinfoKey;
    }
    let infor = (new IpInformation(ipAddress, driver, addition)).get()
    infor.then((data) => {
        return response.json(data)
    })
    .catch((error) => {
        return response.json(error)
    });
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});