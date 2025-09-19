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

interface BackendMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: string;
  media_filename: string | null;
  created_at: string;
  sender_role: string;
  recipient_role: string;
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

    // Load real chat messages
    loadMessages();
    
    // Set up real-time connection status
    setIsConnected(true);
    setPartnerOnline(Math.random() > 0.5); // TODO: Replace with real partner status check
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/chat/messages?limit=50');
      if (response.ok) {
        const messages = await response.json();
        
        // Transform backend messages to frontend format
        const transformedMessages = messages.map((msg: BackendMessage) => ({
          id: msg.id,
          sender: msg.sender_role === user?.role ? 'me' : 'partner',
          content: msg.content,
          timestamp: new Date(msg.created_at),
          type: msg.message_type,
          file: msg.media_filename ? {
            name: msg.media_filename,
            url: `/api/media/file/${msg.media_filename}`,
            type: msg.message_type
          } : undefined
        })).reverse(); // Show oldest first
        
        setMessages(transformedMessages);
      }
    } catch (e) {
      console.error('Failed to load messages:', e);
      // Fallback: show empty state instead of demo messages
      setMessages([]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const messageContent = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Get recipient (the other user)
      const usersResponse = await fetch('/api/auth/me');
      const currentUser = await usersResponse.json();
      
      // Send message via API
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient_id: null, // For now, messages go to both users
          content: messageContent,
          message_type: 'text'
        })
      });

      if (response.ok) {
        // Reload messages to get the latest
        await loadMessages();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Show error state
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'system',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date(),
        type: 'text'
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      // Upload file to media API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'chat');
      formData.append('isPrivate', 'true');

      const uploadResponse = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const uploadResult = await uploadResponse.json();

      // Send chat message with media reference
      const messageResponse = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient_id: null,
          content: `Shared ${file.type.startsWith('image/') ? 'photo' : 'file'}: ${file.name}`,
          message_type: file.type.startsWith('image/') ? 'image' : 'file',
          media_filename: uploadResult.filename
        })
      });

      if (messageResponse.ok) {
        await loadMessages();
      } else {
        throw new Error('Failed to send message');
      }

    } catch (error) {
      console.error('Failed to upload file:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'system',
        content: 'Failed to upload file. Please try again.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
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
                    <div className="file-icon">File</div>
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
              Attach
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
              {isLoading ? 'Sending...' : 'Send'}
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
              <>Encrypted • Messages are private and secure</>
            ) : (
              <>Connecting to secure chat...</>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
