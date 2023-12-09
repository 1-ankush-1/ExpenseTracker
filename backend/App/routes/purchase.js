const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchase.js");

router.get("/buypremium", purchaseController.buyPremium);
router.post("/updatetransactionstatus", purchaseController.updateTransactionStatus);
router.post("/failedtransaction", purchaseController.transactionFailed);

module.exports = router;