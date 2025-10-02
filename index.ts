import express from "express";
import cors from "cors";
import contactRouter from "./api/contact";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors()); // Permite requisições do frontend
app.use(express.json());

// Rota raiz para teste
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Rotas da API
app.use("/api/contact", contactRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
