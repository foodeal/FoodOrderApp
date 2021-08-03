const Invendu = require("../controllers/Menu.controller");


module.exports = function (app, limit) {

    // Get All offres
    app.get("/AllInvendus", Invendu.findAllInvendu, limit);
    // Get offres by Id
    app.get("/Invendus/:invenduId", Invendu.findById, limit);
    // delete offres
    app.delete("/Invendus/:invenduId", Invendu.deleteInvendu, limit);
    //Ajouter offres
    app.post("/Invendu/register", Invendu.create, limit);
    //Update Menu
    app.put("/Invendus/:invenduId", Invendu.updateMenu, limit);
    //multiinvendu Menu
    app.post("/Invendus/MultiAdd", Invendu.MultiAdd, limit);
}