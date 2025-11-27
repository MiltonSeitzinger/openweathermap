"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const port = parseInt(process.env.PORT || '3000', 10);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: '5mb' }));
app.use(body_parser_1.default.urlencoded({ extended: false, limit: '5mb' }));
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE, PATCH');
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
(0, routes_1.default)(app);
app.get('*', (_req, res) => {
    res.status(404).send({ mensaje: 'No existe la ruta' });
});
app.listen(port, () => {
    console.log('Server Running on port: ', port);
});
exports.default = app;
//# sourceMappingURL=index.js.map