module.exports = (app, auth) => {
    app.post("/api/login", require('./login').post);
    app.post("/api/signup", require('./signup').post);
    app.get("/api/account-info", auth, require('./account_info').get);
};