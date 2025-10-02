import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

interface ContactData {
  name: string;
  email: string;
  whatsapp: string;
}

router.post("/contact", async (req: Request, res: Response) => {
  const { name, email, whatsapp } = req.body as ContactData;

  if (!name || !email) {
    return res.status(400).json({ message: "Nome e email são obrigatórios" });
  }

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  try {
    const response = await axios.post(
      process.env.ACTIVECAMPAIGN_URL!,
      {
        contact: {
          email,
          firstName,
          lastName,
          phone: whatsapp,
          tags: ["novo-usuario"]
        }
      },
      {
        headers: {
          "Api-Token": process.env.ACTIVECAMPAIGN_API_KEY!,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json({ message: "Contato adicionado!", data: response.data });

  } catch (error: any) {
    if (error.response?.data?.errors?.[0]?.code === "duplicate") {
      try {
        const getContact = await axios.get(
          `${process.env.ACTIVECAMPAIGN_URL}?email=${encodeURIComponent(email)}`,
          {
            headers: {
              "Api-Token": process.env.ACTIVECAMPAIGN_API_KEY!,
              "Content-Type": "application/json"
            }
          }
        );

        return res.status(200).json({ message: "Contato já existe!", data: getContact.data });
      } catch (err: any) {
        console.error(err.response?.data || err.message);
        return res.status(500).json({ message: "Erro ao buscar contato existente", error: err.message });
      }
    }

    console.error(error.response?.data || error.message);
    return res.status(500).json({ message: "Erro ao adicionar contato", error: error.message });
  }
});

export default router;
