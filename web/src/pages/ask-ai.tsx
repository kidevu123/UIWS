import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/Icon';

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
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connected');
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
    setIsTyping(true);
    setError(null);
    setConnectionStatus('connecting');

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
        setConnectionStatus('error');
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConnectionStatus('connected');
      
      // Simulate typing delay for more natural feel
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content || data.message || 'I apologize, but I encountered an issue responding to you.',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 800);
      
    } catch (err) {
      console.error('Chat error:', err);
      setConnectionStatus('error');
      setError('I apologize, but I\'m having trouble connecting right now. Please try again in a moment.');
      
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I apologize, but I\'m having trouble connecting to my AI brain right now. Please try again in a moment. 💔',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 500);
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
        <p className="page-subtitle">Your private AI companion for personal conversations</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-state">
              <Icon name="brain" size={64} color="var(--accent)" className="empty-icon" />
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
                  <Icon name="heart" size={20} color="var(--rose)" style={{ marginRight: '8px' }} />
                  Relationship guidance
                </button>
                <button 
                  className="starter-prompt"
                  onClick={() => setInput("I'd like to explore new ways to connect personally")}
                >
                  <Icon name="sparkles" size={20} color="var(--gold)" style={{ marginRight: '8px' }} />
                  Personal connection
                </button>
                <button 
                  className="starter-prompt"
                  onClick={() => setInput("Can you help me journal my thoughts and feelings?")}
                >
                  <Icon name="moon" size={20} color="var(--accent)" style={{ marginRight: '8px' }} />
                  Personal journaling
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
            >
              <div className="message-header">
                <div className="message-avatar">
                  {message.role === 'user' ? (
                    <Icon name="heart" size={18} color="white" />
                  ) : (
                    <Icon name="brain" size={18} color="var(--accent)" />
                  )}
                </div>
                <div className="message-meta">
                  <div className="message-sender">
                    {message.role === 'user' ? 'You' : 'AI Companion'}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message message-assistant">
              <div className="message-header">
                <div className="message-avatar">
                  <Icon name="brain" size={18} color="var(--accent)" />
                </div>
                <div className="message-meta">
                  <div className="message-sender">AI Companion</div>
                  <div className="message-status">typing...</div>
                </div>
              </div>
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
          <div className="chat-status">
            <div className={`connection-status status-${connectionStatus}`}>
              {connectionStatus === 'connected' && (
                <>
                  <Icon name="check" size={16} color="#4ade80" style={{ marginRight: '6px' }} />
                  Connected
                </>
              )}
              {connectionStatus === 'connecting' && (
                <>
                  <Icon name="hourglass" size={16} color="#fbbf24" style={{ marginRight: '6px' }} />
                  Connecting...
                </>
              )}
              {connectionStatus === 'error' && (
                <>
                  <Icon name="exclamation" size={16} color="#f87171" style={{ marginRight: '6px' }} />
                  Connection issue
                </>
              )}
            </div>
            {messages.length > 0 && (
              <button 
                className="btn-secondary btn-small"
                onClick={clearConversation}
              >
                <Icon name="trash" size={16} style={{ marginRight: '6px' }} />
                Clear conversation
              </button>
            )}
          </div>
          
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
              {isLoading ? (
                <Icon name="hourglass" size={18} color="white" />
              ) : (
                <Icon name="send" size={18} color="white" />
              )}
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
