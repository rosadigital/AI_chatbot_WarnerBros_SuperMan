import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { OpenAI } from "openai";
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

console.log('Variáveis de ambiente carregadas:', {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ASSISTANT_ID: process.env.ASSISTANT_ID,
  FRONTEND_URL: process.env.FRONTEND_URL,
});

const app = express();
app.use(express.json());

// Configuração do CORS usando variável de ambiente
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: allowedOrigin,
}));

const PORT = 5000;



const API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.ASSISTANT_ID;


const openai = new OpenAI({
    apiKey: API_KEY
})

app.get("/", (req, res) => {
  console.log('Variáveis de ambiente carregadas:', {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ASSISTANT_ID: process.env.ASSISTANT_ID,
    FRONTEND_URL: process.env.FRONTEND_URL,
  });
  res.send("Servidor funcionando corretamente!");
});


// Rota para criar e executar threads
app.post("/threads", async (req, res) => {
    console.log(req.body.messages)
    try {


    const assistant = await openai.beta.assistants.retrieve(
        ASSISTANT_ID
    )

    // Create thread
    const thread = await openai.beta.threads.create();

    // Create Message
    const message = await openai.beta.threads.messages.create(thread.id,
        { role: "user", content: req.body.messages }

    );

    console.log("👉 Mensagem criada:", message);


    // Run assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        // instructions: 'Limite a resposta em ate 10 palavras',
    });

    console.log("👉 Run iniciada:", run);

    // Aguarda até que o status da execução seja 'queued' ou 'completed'
    let runStatus = run.status;
    let attempts = 0;
    const MAX_ATTEMPTS = 30;

    while (runStatus !== "completed") {
        if (attempts >= MAX_ATTEMPTS) {
            return res.status(500).json({
                error: "Execução demorou muito para ser concluída.",
                status: runStatus,
            });
        }

        console.log(`🏃 Status da execução: ${runStatus} (Tentativa ${attempts + 1})`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Aguarda 1 segundo

        // Atualiza o status da execução
        const retrieveRunFromThread = await openai.beta.threads.runs.retrieve(
            run.thread_id,
            run.id
        );

        runStatus = retrieveRunFromThread.status;
        attempts++;
    }

    console.log("🏁 Execução pronta para recuperar mensagens.");

    // Recupera as mensagens da thread
    const retrieveMessage = await openai.beta.threads.messages.list(run.thread_id);

    // Processa e exibe as mensagens
    const messages = retrieveMessage.body.data.map((message) => ({
        role: message.role,
        content: message.content,
    }));

    console.log("💬 Mensagens da thread:", messages);

    // Retorna as mensagens ao cliente
    res.json({
        thread_id: thread.id,
        run_id: run.id,
        messages,
    });
} catch (error) {
    console.error("❌ Erro:", error);
    res.status(500).json({ error: "Erro ao processar a requisição." });
}
});

// Rota anterior de completions (permanece se necessário)
app.post("/completions", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: req.body.messages,
    }),
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch completion from OpenAI." });
  }
});

app.listen(PORT, () => console.log("Your port is running on PORT " + PORT));