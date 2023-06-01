const express = require("express")
const router = express.Router()
const {registerUser,authUser,allUsers,deleteUser} =require("../controllers/userControllers")
const {protect} = require("../middleware/authMiddleware")

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/deleteuser", deleteUser);

module.exports = router;