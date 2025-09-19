import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AskAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai_conversation');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (e) {
        console.error('Failed to load conversation:', e);
      }
    }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_conversation', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Call our API endpoint that proxies to OpenWebUI
      const response = await fetch('/api/ask-ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.message || 'I apologize, but I encountered an issue responding to you.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('I apologize, but I\'m having trouble connecting right now. Please try again in a moment.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('ai_conversation');
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Ask Anything</h1>
        <p className="page-subtitle">Your private AI companion for intimate conversations</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💭</div>
              <h3 className="h3">Start a conversation</h3>
              <p className="sub">
                I'm here to listen, help, and chat about anything on your mind. 
                Your conversations are completely private and never shared.
              </p>
              <div className="starter-prompts">
                <button 
                  className="starter-prompt"
                  onClick={() => setInput("How can I communicate better with my partner?")}
                >
                  💕 Relationship advice
                </button>
                <button 
                  className="starter-prompt"
                  onClick={() => setInput("I'd like to explore new ways to connect intimately")}
                >
                  ✨ Intimacy guidance
                </button>
                <button 
                  className="starter-prompt"
                  onClick={() => setInput("Can you help me journal my thoughts and feelings?")}
                >
                  📝 Journaling support
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
            >
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message message-assistant">
              <div className="message-content typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          {messages.length > 0 && (
            <button 
              className="btn-secondary btn-small"
              onClick={clearConversation}
              style={{ marginBottom: '12px' }}
            >
              🗑️ Clear conversation
            </button>
          )}
          
          <div className="chat-input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts, ask questions, or just chat..."
              className="chat-input"
              rows={3}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="chat-send-btn"
            >
              {isLoading ? '⏳' : '💫'}
            </button>
          </div>
          
          <p className="chat-disclaimer">
            Your conversations are private and stored locally on your device. 
            Powered by Ollama LLM running privately on your server.
          </p>
        </div>
      </div>
    </Layout>
  );
}
