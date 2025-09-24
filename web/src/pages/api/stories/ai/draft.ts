import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { preferences, previousSteps } = req.body;

    if (!preferences || !previousSteps?.outline?.content) {
      return res.status(400).json({ message: 'Preferences and outline content are required' });
    }

    const lengthTargets = {
      short: '500-1000',
      medium: '1000-2000',
      long: '2000-3000'
    };

    const explicitnessGuidance = {
      low: 'Keep intimate scenes tasteful and fade-to-black. Focus on emotional connection and romantic tension.',
      moderate: 'Include intimate scenes with elegant, sensual language. Balance physical and emotional intimacy.',
      high: 'Write detailed intimate scenes with explicit language. Ensure consent and emotional depth.'
    };

    const prompt = `
Based on this story outline:
${previousSteps.outline.content}

Write a complete ${preferences.length} story (target: ${lengthTargets[preferences.length as keyof typeof lengthTargets]} words).

Story Requirements:
- Genre: ${preferences.genre}
- Mood: ${preferences.mood}  
- Content Level: ${preferences.explicitness}
- Characters: ${preferences.characters}
- Setting: ${preferences.setting}

Content Guidelines:
${explicitnessGuidance[preferences.explicitness as keyof typeof explicitnessGuidance]}

Writing Style:
- Use vivid, sensory descriptions
- Show emotions through actions and dialogue
- Create authentic character voices
- Build tension gradually
- Include internal thoughts and feelings
- Write in third person present or past tense
- Use paragraph breaks for readability

Focus on:
- Character development and growth
- Emotional authenticity
- Meaningful dialogue
- Atmospheric descriptions
- Satisfying romantic resolution

Write the complete story now, following the outline structure while allowing for natural creative expansion.
`;

    const response = await fetch('http://gateway:4000/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || ''
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a professional romance novelist known for emotionally compelling, well-crafted stories. You write with beautiful prose, authentic characters, and satisfying romantic arcs.' },
          { role: 'user', content: prompt }
        ]
      }),
      signal: AbortSignal.timeout(60000) // 60 seconds for full story generation
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.content || 'Unable to generate story draft at this time.';
      return res.status(200).json({ content });
    } else if (response.status === 401) {
      return res.status(401).json({ message: 'Authentication required' });
    } else {
      throw new Error(`Gateway responded with status ${response.status}`);
    }

  } catch (error: any) {
    console.error('Story draft API error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        content: 'Story generation is taking longer than expected. This is normal for longer stories. Please try again or consider a shorter length.' 
      });
    }

    res.status(500).json({ 
      content: 'Unable to generate story draft right now. Please try again or contact support if the issue persists.' 
    });
  }
}