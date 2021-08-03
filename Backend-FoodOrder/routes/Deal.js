const Deal = require("../controllers/Deal.controller.js");

module.exports = function (app, limit) {

    // Get All deals
    app.get("/deals", Deal.findAllDeal, limit);
    // // Get deals by id
    app.get("/deals/:deal_id", Deal.findDeal, limit);
    // // Get active deals
    app.get("/activedeals", Deal.findactiveDeal, limit);
    // create deals
    app.post("/deals/dealcreate", Deal.createdeal, limit);
    // // create dealsScheduled
    app.post("/deals/dealscheduled", Deal.createdealscheduled, limit);
    //update quantity
    app.put("/dealsscheduled/:id", Deal.updatedealScheduled, limit);
    //update deal
    app.put("/updatedeals/:id", Deal.updatedeal, limit);
    app.delete("/dealscheduled/:dealsId", Deal.deletedeals, limit);
    app.delete("/dealsDel/:deals_Id", Deal.deletedealss, limit);
    //add reserved coupon
    app.post("/reservedCoupon", Deal.reservedDeal, limit);
    // update type of reserved coupon
    app.put("/reservedCouponUpdate/:id", Deal.updatetypereservedcoupon, limit);
    //Ajouter multipanier
    app.post("/multiPanier", Deal.createMultiDeal, limit);

}