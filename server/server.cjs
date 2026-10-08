const express = require("express");
const cors = require("cors");
require("dotenv").config({
  path: "./server/.env",
});

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// ===============================
// Nexus API configuration
// ===============================

const BASE_URL = process.env.MODEL_API_BASE_URL;
const API_KEY = process.env.MODEL_API_KEY;

// ===============================
// Available AI Models
// ===============================

const MODELS = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
  },
  {
    id: "gpt-4.1-nano",
    name: "GPT-4.1 Nano",
    provider: "OpenAI",
  },
  {
    id: "gpt-4o-mini-tts",
    name: "GPT-4o Mini TTS",
    provider: "OpenAI",
  },
  {
    id: "llama3-8b-instruct",
    name: "Llama 3 8B Instruct",
    provider: "Meta",
  },
  {
    id: "mistral-7b-instruct",
    name: "Mistral 7B Instruct",
    provider: "Mistral",
  },
  {
    id: "nano-banana",
    name: "Nano Banana",
    provider: "Google",
  },
];

// ===============================
// Test Backend
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Nexus AI Backend is running",
  });
});

// ===============================
// Get Models
// ===============================

app.get("/api/models", (req, res) => {
  res.json(MODELS);
});

// ===============================
// Generate AI Response
// ===============================

app.post("/api/generate", async (req, res) => {
  try {
    const { model, prompt } = req.body;

    // Validate request
    if (!model || !prompt) {
      return res.status(400).json({
        error: "Model and prompt are required",
      });
    }

    // Check model
    const selectedModel = MODELS.find((m) => m.id === model);

    if (!selectedModel) {
      return res.status(400).json({
        error: "Invalid model selected",
      });
    }

    // Check API credentials
    if (!BASE_URL || !API_KEY) {
      return res.status(500).json({
        error: "Nexus API URL or API key is missing",
      });
    }

    console.log(`Calling ${selectedModel.name}...`);

    // ===============================
    // Call Nexus API
    // ===============================

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${API_KEY}`,
      },

      body: JSON.stringify({
        model: model,

        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    // ===============================
    // Handle API error
    // ===============================

    if (!response.ok) {
      console.error("Nexus API Error:");
      console.error(data);

      return res.status(response.status).json({
        error: data.error?.message || data.error || "Nexus API request failed",
      });
    }

    // ===============================
    // Extract response
    // ===============================

    const output = data.choices?.[0]?.message?.content;

    if (!output) {
      return res.status(500).json({
        error: "No text response received from model",
        raw: data,
      });
    }

    // ===============================
    // Send to frontend
    // ===============================

    res.json({
      success: true,
      model: model,
      output: output,
    });
  } catch (error) {
    console.error("Server Error:");
    console.error(error);

    res.status(500).json({
      error: "Failed to call Nexus API",
      details: error.message,
    });
  }
});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
