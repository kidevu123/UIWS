import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Icon from '@/components/Icon';
import { authFetch, handleAuthError } from '@/lib/auth';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

interface StoryPreferences {
  genre: string;
  mood: string;
  length: string;
  explicitness: string;
  characters: string;
  setting: string;
}

interface StoryStep {
  id: string;
  title: string;
  content: string;
  loading: boolean;
  error?: string;
}

type WizardStep = 'preferences' | 'brainstorm' | 'outline' | 'draft' | 'refine';

export default function CreateStory() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('preferences');
  const [preferences, setPreferences] = useState<StoryPreferences>({
    genre: 'romance',
    mood: 'romantic',
    length: 'medium',
    explicitness: 'moderate',
    characters: '',
    setting: ''
  });
  
  const [storySteps, setStorySteps] = useState<Record<string, StoryStep>>({
    brainstorm: { id: 'brainstorm', title: 'Story Ideas', content: '', loading: false },
    outline: { id: 'outline', title: 'Story Outline', content: '', loading: false },
    draft: { id: 'draft', title: 'Story Draft', content: '', loading: false },
    refine: { id: 'refine', title: 'Final Story', content: '', loading: false }
  });

  const steps: { key: WizardStep; title: string; description: string }[] = [
    { key: 'preferences', title: 'Preferences', description: 'Set your story preferences' },
    { key: 'brainstorm', title: 'Brainstorm', description: 'Generate story ideas' },
    { key: 'outline', title: 'Outline', description: 'Create story structure' },
    { key: 'draft', title: 'Draft', description: 'Write the story' },
    { key: 'refine', title: 'Refine', description: 'Polish and finalize' }
  ];

  const generateContent = async (stepType: 'brainstorm' | 'outline' | 'draft' | 'rewrite') => {
    setStorySteps(prev => ({
      ...prev,
      [stepType]: { ...prev[stepType], loading: true, error: undefined }
    }));

    try {
      const response = await authFetch(`/api/stories/ai/${stepType}`, {
        method: 'POST',
        body: JSON.stringify({
          preferences,
          previousSteps: storySteps
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate ${stepType}`);
      }

      const data = await response.json();
      
      setStorySteps(prev => ({
        ...prev,
        [stepType]: { 
          ...prev[stepType], 
          content: data.content || data.result || '',
          loading: false 
        }
      }));

      showSuccessToast(`${stepType.charAt(0).toUpperCase() + stepType.slice(1)} generated successfully!`);

    } catch (error: any) {
      if (handleAuthError(error, router)) return;
      
      const errorMessage = error.message || `Failed to generate ${stepType}`;
      setStorySteps(prev => ({
        ...prev,
        [stepType]: { ...prev[stepType], loading: false, error: errorMessage }
      }));
      
      showErrorToast(errorMessage);
    }
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.key === currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStepKey = steps[currentIndex + 1].key;
      setCurrentStep(nextStepKey);
      
      // Auto-generate content for AI steps
      if (['brainstorm', 'outline', 'draft'].includes(nextStepKey)) {
        setTimeout(() => {
          generateContent(nextStepKey as 'brainstorm' | 'outline' | 'draft');
        }, 100);
      }
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'preferences':
        return preferences.characters.trim() && preferences.setting.trim();
      case 'brainstorm':
        return storySteps.brainstorm.content.trim().length > 0;
      case 'outline':
        return storySteps.outline.content.trim().length > 0;
      case 'draft':
        return storySteps.draft.content.trim().length > 0;
      default:
        return true;
    }
  };

  const renderPreferences = () => (
    <div className="story-preferences">
      <div className="form-group">
        <label className="form-label">Genre</label>
        <select 
          value={preferences.genre}
          onChange={(e) => setPreferences({...preferences, genre: e.target.value})}
          className="form-select"
        >
          <option value="romance">Romance</option>
          <option value="fantasy">Fantasy Romance</option>
          <option value="contemporary">Contemporary</option>
          <option value="historical">Historical</option>
          <option value="paranormal">Paranormal</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Mood</label>
        <select 
          value={preferences.mood}
          onChange={(e) => setPreferences({...preferences, mood: e.target.value})}
          className="form-select"
        >
          <option value="romantic">Romantic</option>
          <option value="passionate">Passionate</option>
          <option value="playful">Playful</option>
          <option value="dramatic">Dramatic</option>
          <option value="adventurous">Adventurous</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Story Length</label>
        <select 
          value={preferences.length}
          onChange={(e) => setPreferences({...preferences, length: e.target.value})}
          className="form-select"
        >
          <option value="short">Short (500-1000 words)</option>
          <option value="medium">Medium (1000-2000 words)</option>
          <option value="long">Long (2000+ words)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Content Level</label>
        <select 
          value={preferences.explicitness}
          onChange={(e) => setPreferences({...preferences, explicitness: e.target.value})}
          className="form-select"
        >
          <option value="low">Suggestive (Romantic tension)</option>
          <option value="moderate">Moderate (Intimate scenes)</option>
          <option value="high">Explicit (Adult content)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Characters</label>
        <textarea
          value={preferences.characters}
          onChange={(e) => setPreferences({...preferences, characters: e.target.value})}
          placeholder="Describe your characters (e.g., Sarah, a confident architect, and Marcus, a mysterious artist...)"
          className="form-textarea"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Setting</label>
        <textarea
          value={preferences.setting}
          onChange={(e) => setPreferences({...preferences, setting: e.target.value})}
          placeholder="Describe the setting (e.g., A cozy cabin in the mountains during a snowstorm...)"
          className="form-textarea"
          rows={3}
        />
      </div>
    </div>
  );

  const renderStoryStep = (stepKey: 'brainstorm' | 'outline' | 'draft' | 'refine') => {
    const step = storySteps[stepKey];
    
    return (
      <div className="story-step">
        <div className="story-step-header">
          <h3>{step.title}</h3>
          <div className="story-step-actions">
            {step.content && stepKey !== 'refine' && (
              <button 
                onClick={() => generateContent('rewrite')}
                className="btn btn-secondary"
                disabled={step.loading}
              >
                <Icon name="refresh" size={16} />
                Regenerate
              </button>
            )}
            {!step.content && !step.loading && stepKey !== 'refine' && (
              <button 
                onClick={() => generateContent(stepKey)}
                className="btn btn-primary"
              >
                <Icon name="brain" size={16} />
                Generate
              </button>
            )}
          </div>
        </div>

        <div className="story-content">
          {step.loading && (
            <div className="loading-state">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
              <p>AI is working on your {step.title.toLowerCase()}...</p>
            </div>
          )}

          {step.error && stepKey !== 'refine' && (
            <div className="error-state">
              <Icon name="alert" size={24} />
              <p>{step.error}</p>
              <button 
                onClick={() => generateContent(stepKey)}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {step.content && !step.loading && (
            <div className="story-text">
              <textarea
                value={step.content}
                onChange={(e) => setStorySteps(prev => ({
                  ...prev,
                  [stepKey]: { ...prev[stepKey], content: e.target.value }
                }))}
                className="story-editor"
                rows={stepKey === 'draft' ? 20 : 10}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">AI Story Builder</h1>
        <p className="page-subtitle">Create personalized romantic stories with AI assistance</p>
      </div>

      <div className="story-wizard">
        {/* Progress Indicator */}
        <div className="wizard-progress">
          {steps.map((step, index) => (
            <div 
              key={step.key}
              className={`progress-step ${currentStep === step.key ? 'active' : ''} ${
                steps.findIndex(s => s.key === currentStep) > index ? 'completed' : ''
              }`}
            >
              <div className="step-indicator">
                {steps.findIndex(s => s.key === currentStep) > index ? (
                  <Icon name="check" size={16} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="wizard-content">
          {currentStep === 'preferences' && renderPreferences()}
          {currentStep === 'brainstorm' && renderStoryStep('brainstorm')}
          {currentStep === 'outline' && renderStoryStep('outline')}
          {currentStep === 'draft' && renderStoryStep('draft')}
        {currentStep === 'refine' && (
          <div className="story-step">
            <div className="story-step-header">
              <h3>Final Story</h3>
              <div className="story-step-actions">
                <button 
                  onClick={() => generateContent('rewrite')}
                  className="btn btn-secondary"
                  disabled={!storySteps.draft.content}
                >
                  <Icon name="refresh" size={16} />
                  Polish & Refine
                </button>
              </div>
            </div>
            
            <div className="story-content">
              <div className="story-text">
                <textarea
                  value={storySteps.refine.content || storySteps.draft.content}
                  onChange={(e) => setStorySteps(prev => ({
                    ...prev,
                    refine: { ...prev.refine, content: e.target.value }
                  }))}
                  className="story-editor"
                  rows={25}
                  placeholder="Your final story will appear here. You can edit it directly or click 'Polish & Refine' to improve it with AI."
                />
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Navigation */}
        <div className="wizard-navigation">
          <button 
            onClick={prevStep}
            className="btn btn-secondary"
            disabled={currentStep === 'preferences'}
          >
            <Icon name="arrow-left" size={16} />
            Previous
          </button>

          <div className="nav-spacer" />

          {currentStep !== 'refine' ? (
            <button 
              onClick={nextStep}
              className="btn btn-primary"
              disabled={!canProceed()}
            >
              Next Step
              <Icon name="arrow-right" size={16} />
            </button>
          ) : (
            <button 
              onClick={() => showSuccessToast('Story completed! You can edit and save it above.')}
              className="btn btn-success"
            >
              <Icon name="check" size={16} />
              Complete Story
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}