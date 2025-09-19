import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface KinkCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: KinkTag[];
}

interface KinkTag {
  id: string;
  name: string;
  description: string;
  safetyNotes: string[];
  communicationTips: string[];
  category: string;
}

interface UserPreferences {
  interested: string[];
  curious: string[];
  notInterested: string[];
}

// Educational kink database with consent-first approach
const kinkDatabase: KinkCategory[] = [
  {
    id: 'sensory',
    name: 'Sensory Exploration',
    description: 'Engaging different senses to enhance intimate experiences',
    icon: '🌟',
    difficulty: 'Beginner',
    tags: [
      {
        id: 'temperature',
        name: 'Temperature Play',
        description: 'Using hot or cold sensations to enhance pleasure and awareness',
        safetyNotes: ['Test temperature on yourself first', 'Avoid extreme temperatures', 'Have warm towels nearby'],
        communicationTips: ['Establish clear signals', 'Check in frequently', 'Discuss comfort levels beforehand'],
        category: 'sensory'
      },
      {
        id: 'blindfold',
        name: 'Blindfolding',
        description: 'Temporarily removing sight to heighten other senses',
        safetyNotes: ['Use breathable materials', 'Establish safe words', 'Keep hands free for emergency'],
        communicationTips: ['Describe what you\'re doing', 'Ask for feedback', 'Go slowly'],
        category: 'sensory'
      }
    ]
  },
  {
    id: 'power',
    name: 'Power Dynamics',
    description: 'Exploring consensual power exchange in intimate settings',
    icon: '👑',
    difficulty: 'Intermediate',
    tags: [
      {
        id: 'dominance',
        name: 'Gentle Dominance',
        description: 'Taking a leading role in intimate activities with care and consent',
        safetyNotes: ['Start slowly', 'Respect all boundaries', 'Check consent continuously'],
        communicationTips: ['Discuss roles beforehand', 'Use positive reinforcement', 'Debrief afterwards'],
        category: 'power'
      },
      {
        id: 'submission',
        name: 'Willing Submission',
        description: 'Consensually allowing your partner to take the lead',
        safetyNotes: ['Communicate your limits', 'Maintain safe words', 'Trust is essential'],
        communicationTips: ['Be clear about boundaries', 'Express your needs', 'Practice self-advocacy'],
        category: 'power'
      }
    ]
  },
  {
    id: 'roleplay',
    name: 'Role Playing',
    description: 'Exploring different personas and scenarios together',
    icon: '🎭',
    difficulty: 'Beginner',
    tags: [
      {
        id: 'fantasy',
        name: 'Fantasy Scenarios',
        description: 'Acting out imaginative scenes and stories together',
        safetyNotes: ['Keep it consensual', 'Respect comfort zones', 'Have fun with it'],
        communicationTips: ['Plan scenarios together', 'Stay in character appropriately', 'Laugh together'],
        category: 'roleplay'
      }
    ]
  },
  {
    id: 'bondage',
    name: 'Light Bondage',
    description: 'Gentle restraint and control with emphasis on trust',
    icon: '🎀',
    difficulty: 'Advanced',
    tags: [
      {
        id: 'silkties',
        name: 'Silk Restraints',
        description: 'Using soft, comfortable materials for gentle restraint',
        safetyNotes: ['Use silk or soft rope only', 'Never around the neck', 'Keep safety shears nearby', 'Check circulation frequently'],
        communicationTips: ['Discuss limits extensively', 'Use clear safe words', 'Check in every few minutes', 'Plan aftercare'],
        category: 'bondage'
      }
    ]
  }
];

export default function KinksExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    interested: [],
    curious: [],
    notInterested: []
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [currentTag, setCurrentTag] = useState<KinkTag | null>(null);
  const [consentAgreed, setConsentAgreed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kink_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load preferences:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kink_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (tagId: string, type: 'interested' | 'curious' | 'notInterested') => {
    setPreferences(prev => {
      const newPrefs = { ...prev };
      // Remove from other categories
      Object.keys(newPrefs).forEach(key => {
        newPrefs[key as keyof UserPreferences] = newPrefs[key as keyof UserPreferences].filter(id => id !== tagId);
      });
      // Add to selected category
      newPrefs[type] = [...newPrefs[type], tagId];
      return newPrefs;
    });
  };

  const getPreferenceForTag = (tagId: string): string | null => {
    if (preferences.interested.includes(tagId)) return 'interested';
    if (preferences.curious.includes(tagId)) return 'curious';
    if (preferences.notInterested.includes(tagId)) return 'notInterested';
    return null;
  };

  const getAllTags = (): KinkTag[] => {
    return kinkDatabase.flatMap(category => category.tags);
  };

  const startQuiz = () => {
    if (consentAgreed) {
      setShowQuiz(true);
      setQuizStep(0);
    }
  };

  const nextQuizStep = () => {
    const allTags = getAllTags();
    if (quizStep < allTags.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setShowQuiz(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Kink Explorer</h1>
        <p className="page-subtitle">Discover and explore desires with consent and communication</p>
      </div>

      {!consentAgreed ? (
        <div className="consent-container">
          <div className="consent-card">
            <h3 className="h3">Consent & Communication First</h3>
            <p>
              This explorer is designed to help you and your partner discover and discuss 
              desires in a safe, educational environment. Everything here emphasizes:
            </p>
            <ul className="consent-principles">
              <li>💝 <strong>Enthusiastic Consent</strong> - All activities require clear, ongoing agreement</li>
              <li>🗣️ <strong>Open Communication</strong> - Honest discussion about boundaries and desires</li>
              <li>🛡️ <strong>Safety First</strong> - Physical and emotional safety are paramount</li>
              <li>🤝 <strong>Mutual Respect</strong> - Both partners' comfort and limits are equally important</li>
              <li>🎯 <strong>Education Focus</strong> - Learning about practices safely and responsibly</li>
            </ul>
            <p>
              By continuing, you agree to approach all content with maturity, respect, and 
              a commitment to consensual exploration.
            </p>
            <button 
              className="btn"
              onClick={() => setConsentAgreed(true)}
            >
              I understand and agree to these principles
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="kinks-navigation">
            <div className="kinks-actions">
              <button 
                className="btn"
                onClick={startQuiz}
              >
                🔍 Take Discovery Quiz
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setPreferences({ interested: [], curious: [], notInterested: [] })}
              >
                🗑️ Reset Preferences
              </button>
            </div>

            <div className="preference-summary">
              <div className="preference-count interested">
                💚 Interested: {preferences.interested.length}
              </div>
              <div className="preference-count curious">
                💛 Curious: {preferences.curious.length}
              </div>
              <div className="preference-count not-interested">
                ❤️ Not for me: {preferences.notInterested.length}
              </div>
            </div>
          </div>

          <div className="kinks-categories">
            {kinkDatabase.map((category) => (
              <div
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <div className="category-difficulty">
                    Difficulty: <span className={`difficulty-${category.difficulty.toLowerCase()}`}>
                      {category.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedCategory && (
            <div className="kinks-tags">
              <h3 className="h3">Explore {kinkDatabase.find(c => c.id === selectedCategory)?.name}</h3>
              <div className="tags-grid">
                {kinkDatabase
                  .find(c => c.id === selectedCategory)
                  ?.tags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`tag-card ${getPreferenceForTag(tag.id) || ''}`}
                      onClick={() => setCurrentTag(tag)}
                    >
                      <h4 className="tag-name">{tag.name}</h4>
                      <p className="tag-description">{tag.description}</p>
                      <div className="tag-actions">
                        <button
                          className={`preference-btn interested ${getPreferenceForTag(tag.id) === 'interested' ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePreference(tag.id, 'interested');
                          }}
                        >
                          💚 Interested
                        </button>
                        <button
                          className={`preference-btn curious ${getPreferenceForTag(tag.id) === 'curious' ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePreference(tag.id, 'curious');
                          }}
                        >
                          💛 Curious
                        </button>
                        <button
                          className={`preference-btn not-interested ${getPreferenceForTag(tag.id) === 'notInterested' ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePreference(tag.id, 'notInterested');
                          }}
                        >
                          ❤️ Not for me
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {showQuiz && (
            <div className="quiz-modal" onClick={() => setShowQuiz(false)}>
              <div className="quiz-content" onClick={(e) => e.stopPropagation()}>
                <div className="quiz-header">
                  <h3>Discovery Quiz</h3>
                  <div className="quiz-progress">
                    {quizStep + 1} of {getAllTags().length}
                  </div>
                </div>
                <div className="quiz-tag">
                  {(() => {
                    const tag = getAllTags()[quizStep];
                    return (
                      <div>
                        <h4>{tag.name}</h4>
                        <p>{tag.description}</p>
                        <div className="quiz-actions">
                          <button
                            className="preference-btn interested"
                            onClick={() => {
                              updatePreference(tag.id, 'interested');
                              nextQuizStep();
                            }}
                          >
                            💚 Interested
                          </button>
                          <button
                            className="preference-btn curious"
                            onClick={() => {
                              updatePreference(tag.id, 'curious');
                              nextQuizStep();
                            }}
                          >
                            💛 Curious
                          </button>
                          <button
                            className="preference-btn not-interested"
                            onClick={() => {
                              updatePreference(tag.id, 'notInterested');
                              nextQuizStep();
                            }}
                          >
                            ❤️ Not for me
                          </button>
                          <button
                            className="btn-secondary btn-small"
                            onClick={nextQuizStep}
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {currentTag && (
            <div className="tag-modal" onClick={() => setCurrentTag(null)}>
              <div className="tag-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="tag-modal-header">
                  <h3>{currentTag.name}</h3>
                  <button onClick={() => setCurrentTag(null)}>✕</button>
                </div>
                <div className="tag-modal-body">
                  <p>{currentTag.description}</p>
                  
                  <div className="safety-section">
                    <h4>🛡️ Safety Notes</h4>
                    <ul>
                      {currentTag.safetyNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="communication-section">
                    <h4>🗣️ Communication Tips</h4>
                    <ul>
                      {currentTag.communicationTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
