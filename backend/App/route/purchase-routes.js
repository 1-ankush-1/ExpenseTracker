const express = require("express");
const router = express.Router();
const purchaseController = require("../controller/purchase-controller.js");

router.get("/buypremium", purchaseController.buyPremium);
router.post("/updatetransactionstatus", purchaseController.updateTransactionStatus);

module.exports = router;