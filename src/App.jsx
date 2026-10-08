import { useState } from "react";
import "./App.css";

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

function App() {
  const [prompt, setPrompt] = useState("");

  const [selectedModel, setSelectedModel] = useState(MODELS[0]);

  const [output, setOutput] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // Generate AI response
  // ==========================================

  const generateResponse = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      // Call YOUR backend
      const response = await fetch("http://localhost:5001/api/generate", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: selectedModel.id,
          prompt: prompt,
        }),
      });

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        throw new Error(data.error || "API request failed");
      }

      // Display AI response
      setOutput(data.output);
    } catch (err) {
      console.error(err);

      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Copy output
  // ==========================================

  const copyOutput = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // ==========================================
  // Clear everything
  // ==========================================

  const clearAll = () => {
    setPrompt("");
    setOutput("");
    setError("");
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="app">
      {/* Background */}
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">✦</div>

          <span>
            Model<span className="highlight">Lab</span>
          </span>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          API Playground
        </div>
      </nav>

      {/* Main */}
      <main className="container">
        {/* Header */}
        <section className="hero">
          <div className="badge">
            <span>⚡</span>
            AI MODEL PLAYGROUND
          </div>

          <h1>
            Test your AI models
            <br />
            <span>in one place.</span>
          </h1>

          <p>
            Connect your model APIs, send prompts, and see responses instantly
            in a clean interface.
          </p>
        </section>

        {/* Workspace */}
        <section className="workspace">
          {/* =====================================
              LEFT PANEL
          ===================================== */}

          <div className="panel">
            {/* Model */}
            <div className="panel-header">
              <div>
                <div className="panel-title">
                  <span className="number">01</span>
                  Model
                </div>

                <div className="panel-subtitle">Choose the AI model</div>
              </div>
            </div>

            {/* Model dropdown */}
            <select
              className="model-select"
              value={selectedModel.id}
              onChange={(e) => {
                const model = MODELS.find((m) => m.id === e.target.value);

                setSelectedModel(model);

                // Clear previous response
                setOutput("");

                setError("");
              }}
            >
              {MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} — {model.provider}
                </option>
              ))}
            </select>

            {/* Prompt */}
            <div className="panel-header prompt-header">
              <div>
                <div className="panel-title">
                  <span className="number">02</span>
                  Prompt
                </div>

                <div className="panel-subtitle">
                  What would you like to ask?
                </div>
              </div>
            </div>

            {/* Prompt input */}
            <textarea
              className="prompt-input"
              placeholder="Ask your AI model anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === "Enter") {
                  generateResponse();
                }
              }}
            />

            {/* Input footer */}
            <div className="input-footer">
              <span>{prompt.length} characters</span>

              <span>Ctrl + Enter to run</span>
            </div>

            {/* Error */}
            {error && <div className="error-box">⚠️ {error}</div>}

            {/* Buttons */}
            <div className="button-row">
              <button className="clear-button" onClick={clearAll}>
                Clear
              </button>

              <button
                className="generate-button"
                onClick={generateResponse}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>✨ Generate Response</>
                )}
              </button>
            </div>
          </div>

          {/* =====================================
              RIGHT PANEL
          ===================================== */}

          <div className="panel output-panel">
            {/* Output header */}
            <div className="panel-header">
              <div>
                <div className="panel-title">
                  <span className="number">03</span>
                  Model Output
                </div>

                <div className="panel-subtitle">
                  Response from {selectedModel.name}
                </div>
              </div>

              {/* Copy */}
              {output && (
                <button className="copy-button" onClick={copyOutput}>
                  📋 Copy
                </button>
              )}
            </div>

            {/* Output box */}
            <div className={`output-box ${loading ? "loading" : ""}`}>
              {loading ? (
                <div className="loading-state">
                  <div className="loader"></div>

                  <p>Waiting for model response...</p>
                </div>
              ) : output ? (
                <div className="response-text">{output}</div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">✦</div>

                  <h3>Your response will appear here</h3>

                  <p>
                    Enter a prompt and click
                    <br />
                    <strong>Generate Response</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <span>ModelLab</span>

          <span>•</span>

          <span>Powered by Nexus AI</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
