// State management: map persona to their last active sessionId
const personaSessions = {
    hitesh: 'session-hitesh-' + Date.now(),
    piyush: 'session-piyush-' + Date.now()
};
let currentPersona = 'hitesh';

const messagesContainer = document.getElementById('chat-messages');
const newChatBtn = document.getElementById('new-chat-btn');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const selectionScreen = document.getElementById('selection-screen');
const chatContainer = document.getElementById('chat-container');

// Header elements
const headerAvatar = document.getElementById('header-avatar');
const headerName = document.getElementById('header-name');
const headerTagline = document.getElementById('header-tagline');

const PERSONA_DATA = {
    hitesh: {
        name: 'Hitesh',
        tagline: 'The Calm Mentor',
        accentClass: 'hitesh-active',
        avatarClass: 'hitesh-gradient',
        taglineClass: 'tagline-blue',
        image: 'images/hitesh.png'
    },
    piyush: {
        name: 'Piyush',
        tagline: 'The Energetic Expert',
        accentClass: 'piyush-active',
        avatarClass: 'piyush-gradient',
        taglineClass: 'tagline-orange',
        image: 'images/piyush.webp'
    }
};

function getCurrentSessionId() {
    return personaSessions[currentPersona];
}

function updateHeader() {
    const data = PERSONA_DATA[currentPersona];
    headerName.textContent = data.name;
    headerTagline.textContent = data.tagline;
    headerTagline.className = data.taglineClass;

    // Reset avatar classes and set new one
    headerAvatar.className = `avatar-small ${data.avatarClass}`;
    headerAvatar.src = data.image;
}

window.startChat = async (persona) => {
    currentPersona = persona;
    updateHeader();
    selectionScreen.style.display = 'none';
    chatContainer.style.display = 'flex';
    await fetchGreeting();
};

async function fetchGreeting() {
    const sessionId = getCurrentSessionId();
    messagesContainer.innerHTML = ''; // Clear messages when greeting/switching

    try {
        const response = await fetch('/api/greet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ persona: currentPersona, sessionId: sessionId })
        });
        const data = await response.json();
        
        let replyText = data.reply;
        if (currentPersona === 'hitesh') {
            try {
                const parsed = JSON.parse(data.reply);
                replyText = parsed.text;
            } catch (e) {
                console.error("Failed to parse Hitesh response", e);
            }
        }
        appendMessage(replyText, 'bot');
    } catch (error) {
        console.error("Failed to fetch greeting", error);
    }
}

newChatBtn.onclick = async () => {
    personaSessions[currentPersona] = 'session-' + currentPersona + '-' + Date.now();
    await fetchGreeting();
};

document.querySelectorAll('.persona-toggle button').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const target = e.target;
        document.querySelectorAll('.persona-toggle button').forEach(b => b.classList.remove('active'));
        target.classList.add('active');
        currentPersona = target.id === 'hitesh-btn' ? 'hitesh' : 'piyush';
        
        updateHeader();
        await fetchGreeting();
    });
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    const sessionId = getCurrentSessionId();

    appendMessage(message, 'user');
    userInput.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, persona: currentPersona, sessionId: sessionId })
        });
        const data = await response.json();
        
        let replyText = data.reply;
        if (currentPersona === 'hitesh') {
            try {
                const parsed = JSON.parse(data.reply);
                replyText = parsed.text;
            } catch (e) {
                console.error("Failed to parse Hitesh response", e);
            }
        }

        appendMessage(replyText, 'bot');
    } catch (error) {
        appendMessage('System Error', 'bot');
    }
}

function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    
    if (sender === 'user') {
        div.classList.add(`${currentPersona}-active`);
    } else {
        // Add bot avatar
        const avatar = document.createElement('img');
        avatar.classList.add('bot-avatar', PERSONA_DATA[currentPersona].avatarClass);
        avatar.src = PERSONA_DATA[currentPersona].image;
        div.appendChild(avatar);
    }

    const content = document.createElement('div');
    content.classList.add('message-content');

    // Regex to match markdown code blocks: ```lang code ```
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
        // Add plain text before the code block
        if (match.index > lastIndex) {
            const plainText = text.slice(lastIndex, match.index);
            content.appendChild(document.createTextNode(plainText));
        }

        const codeContent = match[2].trim();

        // Create the code block container
        const pre = document.createElement('pre');
        pre.classList.add('code-block');

        // Add Copy Button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(codeContent).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
            });
        };
        pre.appendChild(copyBtn);

        const code = document.createElement('code');
        if (match[1]) {
            code.classList.add(`language-${match[1]}`);
        }
        code.textContent = codeContent;
        pre.appendChild(code);
        content.appendChild(pre);

        lastIndex = codeBlockRegex.lastIndex;
    }

    // Add remaining text after the last code block
    if (lastIndex < text.length) {
        content.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    div.appendChild(content);
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

sendBtn.onclick = sendMessage;
userInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
