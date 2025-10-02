import express from "express";
import contactRouter from "./api/contact";

const app = express();
app.use(express.json());

app.use("/api", contactRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
