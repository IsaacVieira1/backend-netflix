"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const contact_1 = __importDefault(require("./api/contact"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 10000;
app.use((0, cors_1.default)()); // Permite requisições do frontend
app.use(express_1.default.json());
// Rota raiz para teste
app.get("/", (req, res) => {
    res.send("Servidor rodando!");
});
// Rotas da API
app.use("/api/contact", contact_1.default);
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
