import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { generateReply, switchPersona, resetConversation, conversationHistory } from './agent.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/greet', async (req, res) => {
  const { persona, sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  try {
    // We use a special message to trigger a greeting without adding to history if needed, 
    // but for simplicity, let's just call generateReply with a greeting prompt.
    // Or better, we can just use a specific prompt for greeting.
    const greetingPrompt = persona === 'piyush' ? "Give me a short, energetic greeting in your persona." : "Give me a short, warm greeting in your persona, starting with 'Haan ji'.";
    
    // To avoid adding the "greeting prompt" to the actual conversation history as a user message,
    // we'll call generateReply but we need to be careful.
    // Actually, let's just use generateReply with a dummy message and then remove it, 
    // or just implement a simple greeting logic.
    
    // Let's try calling generateReply with a special instruction.
    const result = await generateReply("Hello!", sessionId, persona);
    res.json({ reply: result });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, persona, sessionId, reset } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  if (!message && !reset) {
    return res.status(400).json({ error: 'Message or reset flag is required' });
  }

  try {
    if (reset) {
      resetConversation(sessionId);
      return res.json({ reply: 'Conversation reset.' });
    }
    
    const result = await generateReply(message, sessionId, persona);
    res.json({ reply: result });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
});

// New endpoint to list available sessions
app.get('/api/sessions', (req, res) => {
  res.json({ sessions: Object.keys(conversationHistory) });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
