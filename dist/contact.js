"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const axios_1 = __importDefault(require("axios"));
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método não permitido" });
    }
    const { name, email, whatsapp } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Nome e email são obrigatórios" });
    }
    const [firstName, ...rest] = name.split(" ");
    const lastName = rest.join(" ");
    try {
        const response = await axios_1.default.post(process.env.ACTIVECAMPAIGN_URL, {
            contact: {
                email,
                firstName,
                lastName,
                phone: whatsapp,
                tags: ["novo-usuario"]
            }
        }, {
            headers: {
                "Api-Token": process.env.ACTIVECAMPAIGN_API_KEY,
                "Content-Type": "application/json"
            }
        });
        return res.status(200).json({ message: "Contato adicionado!", data: response.data });
    }
    catch (error) {
        // Se for duplicado, busca o contato existente
        if (error.response?.data?.errors?.[0]?.code === "duplicate") {
            try {
                const getContact = await axios_1.default.get(`${process.env.ACTIVECAMPAIGN_URL}?email=${encodeURIComponent(email)}`, {
                    headers: {
                        "Api-Token": process.env.ACTIVECAMPAIGN_API_KEY,
                        "Content-Type": "application/json"
                    }
                });
                return res.status(200).json({ message: "Contato já existe!", data: getContact.data });
            }
            catch (err) {
                console.error(err.response?.data || err.message);
                return res.status(500).json({ message: "Erro ao buscar contato existente", error: err.message });
            }
        }
        console.error(error.response?.data || error.message);
        return res.status(500).json({ message: "Erro ao adicionar contato", error: error.message });
    }
}
