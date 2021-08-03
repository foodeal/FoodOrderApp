const auth = require("../controllers/auth.controller.js");
module.exports = function (app, limit) {

    //Sign UP
    app.post("/register", auth.create,limit);
    //Login
    app.post("/login", auth.login,limit);
    //login fb
    app.post("/fb", auth.fb,limit);
    app.post("/verify", auth.verify,limit);

}