import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { preferences, previousSteps } = req.body;

    if (!preferences || !previousSteps) {
      return res.status(400).json({ message: 'Preferences and previous steps are required' });
    }

    // Determine what to rewrite based on current content
    let contentToRewrite = '';
    let rewriteType = '';
    
    if (previousSteps.draft?.content) {
      contentToRewrite = previousSteps.draft.content;
      rewriteType = 'story draft';
    } else if (previousSteps.outline?.content) {
      contentToRewrite = previousSteps.outline.content;
      rewriteType = 'story outline';
    } else if (previousSteps.brainstorm?.content) {
      contentToRewrite = previousSteps.brainstorm.content;
      rewriteType = 'story concepts';
    } else {
      return res.status(400).json({ message: 'No content available to rewrite' });
    }

    const prompt = `
Please rewrite and improve this ${rewriteType}:

${contentToRewrite}

Improvement Guidelines:
- Keep the core story concept and characters
- Enhance emotional depth and authenticity
- Improve pacing and flow
- Add more vivid, sensory details
- Strengthen character motivations
- Ensure consistency with preferences:
  * Genre: ${preferences.genre}
  * Mood: ${preferences.mood}
  * Content Level: ${preferences.explicitness}
  * Setting: ${preferences.setting}

Focus on:
- More compelling dialogue
- Stronger emotional moments
- Better scene transitions
- Enhanced atmosphere and mood
- More authentic character interactions

Create a fresh version that captures the same essence but with improved quality and depth.
`;

    const response = await fetch('http://gateway:4000/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || ''
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are an expert story editor and rewriter. You take existing content and enhance it while maintaining the core elements that make it compelling.' },
          { role: 'user', content: prompt }
        ]
      }),
      signal: AbortSignal.timeout(60000)
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.content || 'Unable to rewrite content at this time.';
      return res.status(200).json({ content });
    } else if (response.status === 401) {
      return res.status(401).json({ message: 'Authentication required' });
    } else {
      throw new Error(`Gateway responded with status ${response.status}`);
    }

  } catch (error: any) {
    console.error('Story rewrite API error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        content: 'Story rewriting is taking longer than expected. Please try again.' 
      });
    }

    res.status(500).json({ 
      content: 'Unable to rewrite content right now. Please try again.' 
    });
  }
}