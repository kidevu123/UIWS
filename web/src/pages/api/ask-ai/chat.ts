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

    // Try gateway first
    const gatewayUrl = process.env.GATEWAY_URL || 'http://gateway:4000';
    
    try {
      const response = await fetch(`${gatewayUrl}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: 'llama3.1:8b-instruct',
          stream: false
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || 
                       data.content || 
                       data.message ||
                       'I\'m here to help with whatever you\'d like to discuss.';
        return res.status(200).json({ content });
      }
    } catch (gatewayError) {
      console.warn('Gateway connection failed:', gatewayError.message);
    }

    // Fallback: Try direct OpenWebUI connection
    try {
      const openwebuiResponse = await fetch('http://openwebui:8080/api/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy-token'
        },
        body: JSON.stringify({
          model: 'llama3.1:8b-instruct',
          messages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        }),
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });

      if (openwebuiResponse.ok) {
        const data = await openwebuiResponse.json();
        const content = data.choices?.[0]?.message?.content || data.content || 'I\'m here to listen and help.';
        return res.status(200).json({ content });
      }
    } catch (openwebuiError) {
      console.warn('OpenWebUI connection failed:', openwebuiError.message);
    }

    // Fallback: Provide thoughtful offline responses
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    let fallbackResponse = '';
    
    if (lastUserMessage.includes('relationship') || lastUserMessage.includes('partner')) {
      fallbackResponse = "Relationships thrive on open communication, trust, and mutual respect. What specific aspect of your relationship would you like to explore together?";
    } else if (lastUserMessage.includes('feel') || lastUserMessage.includes('emotion')) {
      fallbackResponse = "Your feelings are valid and important. Sometimes it helps to acknowledge what we're experiencing without judgment. What emotions are you noticing right now?";
    } else if (lastUserMessage.includes('stress') || lastUserMessage.includes('anxious') || lastUserMessage.includes('worried')) {
      fallbackResponse = "It's natural to feel stressed sometimes. Gentle breathing, mindfulness, and talking through your concerns can help. What's weighing on your mind?";
    } else if (lastUserMessage.includes('connect') || lastUserMessage.includes('intimacy')) {
      fallbackResponse = "Connection comes in many forms - emotional, physical, intellectual, and spiritual. What kind of connection are you hoping to cultivate?";
    } else {
      const thoughtfulResponses = [
        "I appreciate you sharing your thoughts with me. While I'm currently running in offline mode, I want you to know that your feelings and experiences matter.",
        "Thank you for trusting me with your thoughts. Even though my AI capabilities are temporarily limited, I'm here to provide a safe space for reflection.",
        "I value our conversation. While I'm experiencing some technical limitations, please know that whatever you're going through is valid and worthy of attention.",
        "Your openness means a lot. I may be running in simplified mode right now, but I want to remind you that you deserve care, understanding, and support.",
        "I'm grateful you chose to share with me. Though my full AI functionality isn't available at the moment, I encourage you to continue exploring your thoughts and feelings."
      ];
      fallbackResponse = thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)];
    }

    return res.status(200).json({ 
      content: fallbackResponse + "\n\n*Note: I'm currently running in offline mode. Please check the Settings page to configure AI backend connections for full functionality.*"
    });

  } catch (error) {
    console.error('AI Chat API error:', error);
    res.status(500).json({ 
      content: 'I apologize, but I\'m experiencing technical difficulties right now. Please try again in a moment, and consider checking the Settings page for connection status.' 
    });
  }
}