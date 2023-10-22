module.exports = (app, auth, admin) => {
    app.get("/api/year-data", auth, require('./year-data').get);
    app.get("/api/search-instruments", auth, require('./search-instruments').get);
    app.get("/api/is-favorite", auth, require('./is-favorite').get);
    app.get("/api/add-favorite", auth, require('./add-favorite').get);
    app.get("/api/remove-favorite", auth, require('./remove-favorite').get);
    app.get("/api/get-favorites", auth, require('./get-favorites').get);
    app.get("/api/get-usage-data", admin, require('./usage-data').get);
};