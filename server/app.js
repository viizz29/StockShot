const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const path = require('path');
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')))

const dataProvider = require('./data-provider');
dataProvider.registerRedirectRoot(app);

// Define the auth middleware
const auth = async (req, res, next) => {
    const token = req.headers["x-access-token"] || req.query.token;
    if (!token) {
        return res.status(403).send({
            code: 403,
            msg: "A token is required for authentication"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        //console.log(decoded);
        req.user = decoded;
        dataProvider.countUser(decoded);
        req.dataProvider = dataProvider; //dataProvider becomes accessible to all APIs
    } catch (err) {
        return res.status(401).send({
            code: 401,
            msg: "Invalid Token"
        });
      }
  return next();
}

const admin = async (req, res, next) => {
    const token = req.headers["x-access-token"] || req.query.token;
    if (!token) {
        return res.status(403).send({
            code: 403,
            msg: "A token is required for authentication"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        //console.log(decoded);
        if(!decoded.isAdmin){
            return res.status(403).send({
                code: 403,
                msg: "Insufficient Privileges."
            });
        }

        req.user = decoded;
        dataProvider.countUser(decoded);
        req.dataProvider = dataProvider; //dataProvider becomes accessible to all APIs
    } catch (err) {
        return res.status(401).send({
            code: 401,
            msg: "Invalid Token"
        });
      }
  return next();
}

// register the user account related APIs
require('./apis/account/index')(app, auth);

// register market related APIs
require('./apis/market/index')(app, auth, admin);

// api that serves frontend files
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Ready the data provider after 2 seconds
setTimeout(() => {
    dataProvider.init();
}, 2000);

// start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log("StockShot Server Listening on PORT: ", port);
});