const authController = require("../app/controllers/AuthController");
const router = require("express").Router();

router.get("/signup", authController.signup);
router.post("/register", authController.registerUser);
router.get("/signin", authController.signin);
router.post("/login", authController.loginUser);




module.exports = router;