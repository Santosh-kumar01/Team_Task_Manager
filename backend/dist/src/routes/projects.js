"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const projectCtrl_1 = require("../controllers/projectCtrl");
const auth_1 = require("../middleware/auth");
router.route('/')
    .get(auth_1.protect, projectCtrl_1.getProjects)
    .post(auth_1.protect, projectCtrl_1.createProject);
router.route('/:id')
    .get(auth_1.protect, projectCtrl_1.getProjectById)
    .put(auth_1.protect, projectCtrl_1.updateProject)
    .delete(auth_1.protect, projectCtrl_1.deleteProject);
exports.default = router;
