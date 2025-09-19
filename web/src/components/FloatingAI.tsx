import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        text: 'Hi! I\'m your personal AI assistant. I\'m here to help with wellness advice, answer questions, or just chat. How can I assist you today?',
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I apologize, but I\'m having trouble responding right now. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI request failed:', error);
      setError('Unable to connect to AI assistant. Please check your connection and try again.');
      
      // Auto-retry after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-widget">
      <button 
        className="ai-widget-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Assistant"
      >
        <Icon name="brain" size={24} />
      </button>

      <div className={`ai-widget-panel ${isOpen ? 'open' : ''}`}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid var(--stroke)',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
          borderRadius: 'var(--radius-large) var(--radius-large) 0 0',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="brain" size={20} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>AI Assistant</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Always here to help</div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ 
                marginLeft: 'auto', 
                background: 'none', 
                border: 'none', 
                color: 'white',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>

        <div style={{ 
          height: '300px', 
          overflowY: 'auto', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((message) => (
            <div 
              key={message.id}
              style={{
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: message.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: message.sender === 'user' 
                  ? 'linear-gradient(135deg, var(--accent), var(--accent-secondary))'
                  : 'var(--glass-elevated)',
                color: message.sender === 'user' ? 'white' : 'var(--ink)',
                fontSize: '14px',
                lineHeight: '1.4'
              }}
            >
              {message.text}
            </div>
          ))}
          
          {isLoading && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="loading-spinner"></div>
              <span style={{ fontSize: '14px', opacity: 0.7 }}>AI is thinking...</span>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message" style={{ margin: '12px 16px' }}>
            {error}
          </div>
        )}

        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid var(--stroke)',
          display: 'flex',
          gap: '8px'
        }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid var(--stroke)',
              borderRadius: '12px',
              background: 'var(--glass)',
              color: 'var(--ink)',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
              color: 'white',
              cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !inputText.trim() ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isLoading ? <div className="loading-spinner"></div> : <Icon name="send" size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}