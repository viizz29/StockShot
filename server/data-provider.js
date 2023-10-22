const rxdb = require('rxdb');
const rxdb_storage = require('rxdb/plugins/storage-memory');
const fyersClient = require('fyers-api-v2');
const { spawn } = require('child_process');
const fs = require("fs");
const { parse } = require("csv-parse");
        
const API_CALL_LIMIT = 10000;
const DATA_REFRESH_INTERVAL = 300000; // milliseconds
const LOGGING = false;
class DataProvider{
    constructor(){
        this.port = process.env.PORT;
        this.AppID = process.env.FYERS_APP_ID;
        this.SecretID = process.env.FYERS_APP_SECRET;
        this.redirectUrl = process.env.BASE_URL + ":" + this.port + "/api/fyers-redirect";
        this.database = null; // in memory RxDB for search api
        this.history = null;
        this.api_request_count = 0;
        this.cached_data = {};
        this.app_request_count=0;
        this.app_users = {};
    }

    registerRedirectRoot(app){
        // api that receives the auth code
        app.get("/api/fyers-redirect", (req, res)=>{
            this.on_login_success(req.query.auth_code);
            res.status(200).send("OK, You can close this window.");
        });
    }

    async init(){
        await this.prepareDatabase();
        await this.loadStockList();
        await this.brokerLogin();
    }

    async prepareDatabase(){
        const schema = {
            version: 0,
            primaryKey: 'id',
            type: 'object',
            properties: {
                label: {
                    type: 'string',
                    maxLength: 200,
                },
                id: {
                    type: 'string',
                    maxLength: 20,
                }
            },
            required: ['label', 'id']
        }

        this.database = await rxdb.createRxDatabase({
            name: 'stockshot',
            storage: rxdb_storage.getRxStorageMemory()
        }); 

        await this.database.addCollections({
            instruments: {
                schema: schema
            }
        });
    }

    async loadStockList()
    {
        fs.createReadStream("./EQUITY_L.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", async (row) => {
            //console.log(row);
            await this.database.instruments.insert({
                label: (row[0] + ': ' + row[1]).toLowerCase(),
                id: row[0],
            });
        })
        .on("end", function () {
            if(LOGGING)
                console.log("stock data loaded successfully ..");
        })
        .on("error", function (error) {
            console.log(error.message);
        });
    }

    async brokerLogin()
    {
        // login flow
        const authCodeUrl = "https://api.fyers.in/api/v2/generate-authcode?client_id="+this.AppID+"&redirect_uri="+this.redirectUrl+"&response_type=code&state=None";
        spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [authCodeUrl,]);
    }

    async on_login_success(auth_code){
        if(LOGGING)
            console.log("Auth Code Received: " + auth_code);
        
        fyersClient.setAppId(this.AppID);
        fyersClient.setRedirectUrl(this.redirectUrl);

        let access_token_data = await fyersClient.generate_access_token({
            auth_code: auth_code,
            client_id: this.AppID,
            secret_key: this.SecretID
        });
        //console.log("Access Token Data: ");
        //console.log(access_token_data);
        fyersClient.setAccessToken(access_token_data.access_token);
        this.history = new fyersClient.history();

        //console.log(await fyersClient.get_profile());
    }

    getDatabase(){
        return this.database;
    }

    async getOneYearData(symbol){
        let timestamp = Date.now();
        if(this.cached_data.hasOwnProperty(symbol))
        {
            let data = this.cached_data[symbol];
            if(timestamp - data.timestamp < DATA_REFRESH_INTERVAL)
            {
                //console.log("serving cached data");
                return {candles: data.candles};
            }
        }

        this.api_request_count++;
        let data = await this.history.setSymbol("NSE:"+symbol+"-EQ")
        .setResolution('D')
        .setDateFormat(1)
        .setRangeFrom('2022-10-10')
        .setRangeTo('2023-10-05')
        .getHistory();

        this.cached_data[symbol] = {timestamp: timestamp, candles: data.candles};
        //console.log("serving fresh data");
        return new Promise((resolve) => {
            setTimeout(() => resolve(data), 300);
        });
        
    }

    countUser(user){
        this.app_request_count++;
        if(this.app_users.hasOwnProperty(user.id)){
            this.app_users[user.id].request_count++;
        }
        else{
            this.app_users[user.id] = {user: user, request_count: 1};
        }
    }
    getUsageData(){
        return {
            app_request_count: this.app_request_count,
            broker_api_call_count: this.api_request_count,
            app_users: this.app_users
        };
    }
}
module.exports = new DataProvider();
