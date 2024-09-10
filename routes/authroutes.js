const express = require("express");
const {
  handleregister,
  handlelogin,
} = require("../controllers/Authcontrollers");
const router = express.Router();

router.post("/register", handleregister);
router.post("/login", handlelogin);

module.exports = router;
