import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ message: 'Preferences are required' });
    }

    const prompt = `
You are a creative story brainstorming assistant. Generate 3-5 compelling story concepts based on these preferences:

Genre: ${preferences.genre}
Mood: ${preferences.mood}
Length: ${preferences.length}
Content Level: ${preferences.explicitness}
Characters: ${preferences.characters}
Setting: ${preferences.setting}

For each concept, provide:
1. A compelling title
2. A brief premise (2-3 sentences)
3. Key dramatic tension or conflict
4. Potential romantic arc

Keep the tone ${preferences.mood} and ensure content appropriateness matches the ${preferences.explicitness} level.
Focus on emotional depth and character connection.
`;

    const response = await fetch('http://gateway:4000/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || ''
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a professional romance story consultant and creative writing assistant. You help create compelling, emotionally engaging stories.' },
          { role: 'user', content: prompt }
        ]
      }),
      signal: AbortSignal.timeout(45000) // 45 second timeout for creative tasks
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.content || 'Unable to generate story concepts at this time.';
      return res.status(200).json({ content });
    } else if (response.status === 401) {
      return res.status(401).json({ message: 'Authentication required' });
    } else {
      throw new Error(`Gateway responded with status ${response.status}`);
    }

  } catch (error: any) {
    console.error('Story brainstorm API error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        content: 'Story brainstorming is taking longer than expected. Please try again with simpler preferences.' 
      });
    }

    res.status(500).json({ 
      content: 'Unable to generate story concepts right now. Please check your preferences and try again.' 
    });
  }
}