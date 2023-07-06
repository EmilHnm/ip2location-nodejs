const express = require('express');
const IpInformation = require('./src');
require('dotenv').config();


const app = express();
app.use(express.json());
app.set('trust proxy', true);

app.get('/', (request, response) => {
    let ipAddress = request.query.ip ?? request.ip;
    let ipInformation = (new IpInformation(ipAddress, process.env.DEFAULT_DRIVER));
    ipInformation.retry = true
    ipInformation.get().then((data) => {
        return response.json(data)
    })
    .catch((error) => {
        return response.json(error)
    });
});

app.get('/:driver', (request, response) => {
    let ipAddress = request.query.ip ?? request.ip;
    let driver = request.params.driver;
    if(driver.toLocaleLowerCase() === 'ipinfo') {
        addition = request.query.ipinfoKey;
    }
    let infor = (new IpInformation(ipAddress, driver)).get()
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