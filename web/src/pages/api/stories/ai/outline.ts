import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { preferences, previousSteps } = req.body;

    if (!preferences || !previousSteps?.brainstorm?.content) {
      return res.status(400).json({ message: 'Preferences and brainstorm content are required' });
    }

    const lengthGuidance = {
      short: '500-1000 words with 3-4 key scenes',
      medium: '1000-2000 words with 5-7 key scenes',  
      long: '2000+ words with 8-10 key scenes'
    };

    const prompt = `
Based on this story brainstorm:
${previousSteps.brainstorm.content}

Create a detailed story outline for a ${preferences.length} story (${lengthGuidance[preferences.length as keyof typeof lengthGuidance] || lengthGuidance.medium}).

Structure the outline with:
1. **Opening Scene** - How the characters meet or reconnect
2. **Rising Action** - Building tension and attraction (2-3 scenes)
3. **Conflict/Turning Point** - Major obstacle or misunderstanding
4. **Climax** - Emotional confrontation or realization
5. **Resolution** - How they come together

For each scene, include:
- Setting and mood
- Character motivations
- Key dialogue or action points
- Emotional progression
- Transition to next scene

Keep the ${preferences.mood} tone and ${preferences.explicitness} content level throughout.
Focus on emotional authenticity and character growth.
`;

    const response = await fetch('http://gateway:4000/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || ''
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are an expert story structure consultant who creates detailed, emotionally compelling outlines for romance stories.' },
          { role: 'user', content: prompt }
        ]
      }),
      signal: AbortSignal.timeout(45000)
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.content || 'Unable to generate story outline at this time.';
      return res.status(200).json({ content });
    } else if (response.status === 401) {
      return res.status(401).json({ message: 'Authentication required' });
    } else {
      throw new Error(`Gateway responded with status ${response.status}`);
    }

  } catch (error: any) {
    console.error('Story outline API error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        content: 'Story outline generation is taking longer than expected. Please try again.' 
      });
    }

    res.status(500).json({ 
      content: 'Unable to generate story outline right now. Please try again.' 
    });
  }
}