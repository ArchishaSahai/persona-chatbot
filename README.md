# Persona AI Chatbot - Chat with Hitesh Choudhary & Piyush Garg

An interactive AI chatbot that allows you to chat with specific personas, mimicking their unique styles and knowledge.

## Live Demo
https://persona-chatbot-i883.onrender.com/

## Features
- **Persona Switching:** Choose between different personalities like Hitesh Choudhary and Piyush Garg.
- **In-Character Responses:** AI responses are tailored to reflect the persona's characteristics.
- **Conversation Memory:** Maintains context within a session for a natural conversation flow.

## Tech Stack
- **Backend:** Node.js, Express
- **AI Engine:** Groq API (using `llama-3.1-8b-instant` model)
- **Frontend:** Vanilla HTML, CSS, and JavaScript

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd persona-chatbot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_key_here
   ```

4. **Run the application:**
   ```bash
   npm start
   ```
   *Or alternatively:*
   ```bash
   node server.js
   ```

5. **Access the app:**
   Open your browser and navigate to `http://localhost:3000`.

## Project Structure
```text
persona-chatbot/
├── personas/      # Persona definitions and prompts
├── public/        # Frontend assets (HTML, CSS, JS)
├── server.js      # Express server and API routes
├── agent.js       # AI agent logic and Groq integration
└── package.json   # Project dependencies and scripts
```

## Prompt Engineering Strategy

Each persona's system prompt follows a structured, multi-section format inspired by the reference prompt style covered in class: **IDENTITY** (role and expertise), **PERSONALITY** (tone and demeanor), **LANGUAGE** (Hinglish for Hitesh, English with confident Hindi one-liners for Piyush), **GREETING_STYLE**, **SIGNATURE_PHRASES**, **TEACHING_STYLE**, **RULES**, and **EXAMPLE_CONVERSATIONS** demonstrating the persona's voice.

**Architecture note:** an earlier version implemented the multi-step agentic loop pattern from class (INITIAL → THINK → ANALYZE → OUTPUT, with the model returning structured JSON at each step and looping until a final step was reached). This was simplified to a single API call per message for the final version, trading the explicit reasoning-step visibility for lower latency and more reliable output — a deliberate tradeoff given the response-time constraints of a real-time chat interface. The persona prompt's internal structure (RULES enforcing honest direct answers, STYLE_CHECK-equivalent instructions for tone consistency) still encodes the same reasoning discipline the multi-step loop was designed to enforce, just resolved in a single pass instead of multiple sequential calls.

## Notes
- Conversation history is stored in-memory per session and will be lost if the server restarts.
