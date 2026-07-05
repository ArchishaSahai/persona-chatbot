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

## Notes
- Conversation history is stored in-memory per session and will be lost if the server restarts.
