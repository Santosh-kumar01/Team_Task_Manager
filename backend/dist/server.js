"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./src/config/db"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(express_1.default.json());
(0, db_1.default)();
const auth_1 = __importDefault(require("./src/routes/auth"));
const projects_1 = __importDefault(require("./src/routes/projects"));
const tasks_1 = __importDefault(require("./src/routes/tasks"));
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/tasks', tasks_1.default);
const PORT = process.env.PORT || 8080;
app.listen(Number(PORT) || 8080, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
