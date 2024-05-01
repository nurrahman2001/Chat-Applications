const { register, login, SetAvatar, getAllUsers } = require("../controllers/userController");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/SetAvatar/:id",SetAvatar);
router.get("/allusers/:id",getAllUsers);

module.exports = router;
