"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authCtrl_1 = require("../controllers/authCtrl");
const auth_1 = require("../middleware/auth");
router.post('/register', authCtrl_1.registerUser);
router.post('/login', authCtrl_1.loginUser);
router.post('/logout', authCtrl_1.logoutUser);
router.get('/me', auth_1.protect, authCtrl_1.getMe);
router.get('/users', auth_1.protect, authCtrl_1.getAllUsers);
exports.default = router;
