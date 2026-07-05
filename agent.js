import 'dotenv/config';
import OpenAI from 'openai';
import { SYSTEM_PROMPT as hiteshPrompt } from './personas/hitesh.js';
import { SYSTEM_PROMPT as piyushPrompt } from './personas/piyush.js';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const AGENT_STATE = {
  activePersona: 'hitesh',
};

export const conversationHistory = {}; // Maps sessionId -> array of messages

export function switchPersona(name) {
  if (name === 'hitesh' || name === 'piyush') {
    AGENT_STATE.activePersona = name;
  }
}

export function resetConversation(sessionId) {
  if (conversationHistory[sessionId]) {
    conversationHistory[sessionId] = [];
  }
}

export async function generateReply(userMessage, sessionId, persona = AGENT_STATE.activePersona) {
  console.log(`User message: ${userMessage} (Session: ${sessionId})`);
  
  if (!conversationHistory[sessionId]) {
    conversationHistory[sessionId] = [];
    conversationHistory[sessionId].push({
      role: 'system',
      content: persona === 'piyush' ? piyushPrompt : hiteshPrompt,
    });
  }

  conversationHistory[sessionId].push({ role: 'user', content: userMessage });

  console.time('generateReply');
  
  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: conversationHistory[sessionId],
    });

    const reply = response.choices[0].message.content;

    conversationHistory[sessionId].push({ role: 'assistant', content: reply });

    console.log(`Final response: ${reply}`);
    console.timeEnd('generateReply');
    
    return reply;
  } catch (error) {
    console.timeEnd('generateReply');
    console.error('Error in generateReply:', error);
    return 'Sorry, there was a technical glitch. Could you please rephrase or try again?';
  }
}
