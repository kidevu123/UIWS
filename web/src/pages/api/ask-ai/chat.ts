import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid messages format' });
    }

    // Proxy request to the gateway which handles OpenWebUI/Ollama integration
    const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:4000';
    
    const response = await fetch(`${gatewayUrl}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: 'llama3.1:8b-instruct', // Default model
        stream: false
      })
    });

    if (!response.ok) {
      console.error('Gateway AI error:', response.status, await response.text());
      return res.status(500).json({ 
        message: 'I apologize, but I\'m having trouble connecting to my AI brain right now. Please try again in a moment.' 
      });
    }

    const data = await response.json();
    
    // Extract the content from the response
    const content = data.choices?.[0]?.message?.content || 
                   data.content || 
                   data.message ||
                   'I apologize, but I encountered an issue responding to you.';

    res.status(200).json({ content });

  } catch (error) {
    console.error('AI Chat API error:', error);
    res.status(500).json({ 
      message: 'I apologize, but I\'m experiencing some technical difficulties. Please try again in a moment.' 
    });
  }
}