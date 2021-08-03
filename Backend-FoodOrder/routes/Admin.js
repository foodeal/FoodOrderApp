const Admin = require("../controllers/Admin.controller.js");

module.exports = function (app, limit) {

    //Sign UP
    app.post("/Admin/register", Admin.create,limit);
    //Login
    app.post("/Admin/login", Admin.login,limit);

}