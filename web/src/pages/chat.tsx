import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

export default function PrivateChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get user info
    fetch('/api/me')
      .then(r => r.json())
      .then(setUser)
      .catch(console.error);

    // Simulate connection to VoceChat
    setIsConnected(true);
    setPartnerOnline(Math.random() > 0.5); // Simulate partner online status

    // Load demo messages
    const demoMessages: ChatMessage[] = [
      {
        id: '1',
        sender: 'partner',
        content: 'Hey beautiful, how was your day? 💕',
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      },
      {
        id: '2', 
        sender: 'me',
        content: 'It was wonderful thinking about you all day ✨',
        timestamp: new Date(Date.now() - 240000),
        type: 'text'
      }
    ];
    setMessages(demoMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      content: input.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate sending through VoceChat API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate partner response occasionally
      if (Math.random() > 0.7) {
        setTimeout(() => {
          const responses = [
            "I love hearing from you 💖",
            "That sounds amazing! Tell me more",
            "You always know how to make me smile ✨",
            "I can't wait to be with you again 💝"
          ];
          
          const partnerMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'partner',
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            type: 'text'
          };
          
          setMessages(prev => [...prev, partnerMessage]);
        }, 1000 + Math.random() * 2000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      content: `Shared ${file.type.startsWith('image/') ? 'photo' : 'file'}: ${file.name}`,
      timestamp: new Date(),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      file: {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }
    };

    setMessages(prev => [...prev, newMessage]);
    e.target.value = '';
  };

  const getPartnerName = () => {
    return user?.role === 'her' ? 'Handsome' : 'Gorgeous';
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Private Chat</h1>
        <p className="page-subtitle">Your secure space for private conversations</p>
      </div>

      <div className="private-chat-container">
        <div className="chat-header">
          <div className="partner-info">
            <div className="partner-avatar">
              {user?.role === 'her' ? '👨' : '👩'}
            </div>
            <div className="partner-details">
              <div className="partner-name">{getPartnerName()}</div>
              <div className={`partner-status ${partnerOnline ? 'online' : 'offline'}`}>
                {partnerOnline ? '🟢 Online now' : '⚫ Last seen recently'}
              </div>
            </div>
          </div>
          <div className="chat-controls">
            <button className="btn-secondary btn-small">📞 Call</button>
            <button className="btn-secondary btn-small">📹 Video</button>
          </div>
        </div>

        <div className="chat-messages private-chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'me' ? 'message-user' : 'message-partner'}`}
            >
              <div className="message-content">
                {message.type === 'image' && message.file ? (
                  <div className="message-media">
                    <img src={message.file.url} alt={message.file.name} />
                    <p>{message.content}</p>
                  </div>
                ) : message.type === 'file' && message.file ? (
                  <div className="message-file">
                    <div className="file-icon">📎</div>
                    <div>
                      <div className="file-name">{message.file.name}</div>
                      <div className="file-size">Click to download</div>
                    </div>
                  </div>
                ) : (
                  message.content
                )}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div className="chat-input-container">
            <button 
              className="media-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Send photo or file"
            >
              📎
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a loving message..."
              className="chat-input"
              rows={2}
              disabled={isLoading || !isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || !isConnected}
              className="chat-send-btn"
            >
              {isLoading ? '⏳' : '💌'}
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          
          <div className="chat-disclaimer">
            {isConnected ? (
              <>💝 End-to-end encrypted • Messages are private and secure</>
            ) : (
              <>🔄 Connecting to secure chat...</>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
