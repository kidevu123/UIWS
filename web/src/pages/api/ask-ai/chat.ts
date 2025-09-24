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

    // Forward request to gateway with proper auth
    const response = await fetch('http://gateway:4000/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || ''
      },
      body: JSON.stringify({
        messages,
        stream: false
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout for AI responses
    });

    if (response.ok) {
      const data = await response.json();
      // Normalize response format
      const content = data.content || 
                     data.choices?.[0]?.message?.content || 
                     data.message ||
                     'I\'m here to help with whatever you\'d like to discuss.';
      return res.status(200).json({ content });
    } else if (response.status === 401) {
      return res.status(401).json({ message: 'Authentication required' });
    } else {
      throw new Error(`Gateway responded with status ${response.status}`);
    }

  } catch (error: any) {
    console.error('AI Chat API error:', error);
    
    // Provide helpful error responses based on error type
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        content: 'I apologize, but my response is taking longer than expected. Please try again with a shorter message or check your connection.' 
      });
    }

    // Connection issues
    if (error.message?.includes('fetch')) {
      return res.status(503).json({ 
        content: 'I\'m currently unable to connect to my AI backend. Please check the admin settings to ensure the AI service is configured correctly.' 
      });
    }

    // Generic error with helpful message
    res.status(500).json({ 
      content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment, or contact support if the issue persists.' 
    });
  }
}