"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const taskCtrl_1 = require("../controllers/taskCtrl");
const auth_1 = require("../middleware/auth");
router.route('/')
    .get(auth_1.protect, taskCtrl_1.getTasks)
    .post(auth_1.protect, taskCtrl_1.createTask);
router.route('/:id')
    .put(auth_1.protect, taskCtrl_1.updateTask)
    .delete(auth_1.protect, taskCtrl_1.deleteTask);
exports.default = router;
