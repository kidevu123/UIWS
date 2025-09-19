import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface InterestCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  activities: Interest[];
}

interface Interest {
  id: string;
  name: string;
  description: string;
  gettingStartedTips: string[];
  practiceNotes: string[];
  category: string;
}

interface UserPreferences {
  interested: string[];
  curious: string[];
  notInterested: string[];
}

// Educational interests database for personal development
const interestsDatabase: InterestCategory[] = [
  {
    id: 'creative',
    name: 'Creative Arts',
    description: 'Explore your artistic side through various creative mediums',
    icon: '🎨',
    difficulty: 'Beginner',
    activities: [
      {
        id: 'painting',
        name: 'Painting & Drawing',
        description: 'Express yourself through visual art using various painting and drawing techniques',
        gettingStartedTips: ['Start with basic supplies', 'Watch online tutorials', 'Practice basic shapes first'],
        practiceNotes: ['Set aside regular practice time', 'Join local art groups', 'Experiment with different styles'],
        category: 'creative'
      },
      {
        id: 'photography',
        name: 'Photography',
        description: 'Capture beautiful moments and develop your visual storytelling skills',
        gettingStartedTips: ['Learn composition basics', 'Practice with your phone camera', 'Study light and shadows'],
        practiceNotes: ['Take photos daily', 'Share with photography communities', 'Try different genres'],
        category: 'creative'
      }
    ]
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    description: 'Physical activities and wellness practices for a healthy lifestyle',
    icon: '💪',
    difficulty: 'Intermediate',
    activities: [
      {
        id: 'running',
        name: 'Running & Jogging',
        description: 'Cardiovascular exercise that builds endurance and mental strength',
        gettingStartedTips: ['Start with short distances', 'Invest in good running shoes', 'Find running routes you enjoy'],
        practiceNotes: ['Build distance gradually', 'Join running clubs', 'Track your progress'],
        category: 'fitness'
      },
      {
        id: 'yoga',
        name: 'Yoga Practice',
        description: 'Mind-body practice combining physical poses, breathing, and meditation',
        gettingStartedTips: ['Take beginner classes', 'Start with basic poses', 'Focus on breath work'],
        practiceNotes: ['Practice regularly', 'Listen to your body', 'Explore different styles'],
        category: 'fitness'
      }
    ]
  },
  {
    id: 'learning',
    name: 'Learning & Development',
    description: 'Intellectual pursuits and skill development activities',
    icon: '📚',
    difficulty: 'Beginner',
    activities: [
      {
        id: 'languages',
        name: 'Language Learning',
        description: 'Acquire new languages to connect with different cultures and people',
        gettingStartedTips: ['Choose languages that interest you', 'Use language learning apps', 'Practice daily'],
        practiceNotes: ['Find conversation partners', 'Watch movies in target language', 'Keep a vocabulary journal'],
        category: 'learning'
      },
      {
        id: 'reading',
        name: 'Reading & Literature',
        description: 'Explore different genres and expand your knowledge through books',
        gettingStartedTips: ['Set a reading goal', 'Join a book club', 'Try different genres'],
        practiceNotes: ['Keep a reading journal', 'Discuss books with others', 'Mix fiction and non-fiction'],
        category: 'learning'
      }
    ]
  },
  {
    id: 'outdoor',
    name: 'Outdoor Activities',
    description: 'Adventures and activities that connect you with nature',
    icon: '🏔️',
    difficulty: 'Intermediate',
    activities: [
      {
        id: 'hiking',
        name: 'Hiking & Nature Walks',
        description: 'Explore natural environments while getting exercise and fresh air',
        gettingStartedTips: ['Start with easy trails', 'Wear appropriate footwear', 'Bring water and snacks'],
        practiceNotes: ['Research trails beforehand', 'Hike with others for safety', 'Leave no trace'],
        category: 'outdoor'
      },
      {
        id: 'gardening',
        name: 'Gardening',
        description: 'Growing plants, flowers, and vegetables for beauty and sustenance',
        gettingStartedTips: ['Start with easy plants', 'Learn about your climate zone', 'Begin with containers if needed'],
        practiceNotes: ['Keep a garden journal', 'Connect with local gardening groups', 'Compost organic waste'],
        category: 'outdoor'
      }
    ]
  }
];

export default function InterestsExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    interested: [],
    curious: [],
    notInterested: []
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [currentActivity, setCurrentActivity] = useState<Interest | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('interest_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load preferences:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('interest_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (activityId: string, type: 'interested' | 'curious' | 'notInterested') => {
    setPreferences(prev => {
      const newPrefs = { ...prev };
      // Remove from other categories
      Object.keys(newPrefs).forEach(key => {
        newPrefs[key as keyof UserPreferences] = newPrefs[key as keyof UserPreferences].filter(id => id !== activityId);
      });
      // Add to selected category
      newPrefs[type] = [...newPrefs[type], activityId];
      return newPrefs;
    });
  };

  const getPreferenceForActivity = (activityId: string): string | null => {
    if (preferences.interested.includes(activityId)) return 'interested';
    if (preferences.curious.includes(activityId)) return 'curious';
    if (preferences.notInterested.includes(activityId)) return 'notInterested';
    return null;
  };

  const getAllActivities = (): Interest[] => {
    return interestsDatabase.flatMap(category => category.activities);
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizStep(0);
  };

  const nextQuizStep = () => {
    const allActivities = getAllActivities();
    if (quizStep < allActivities.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setShowQuiz(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Interest Explorer</h1>
        <p className="page-subtitle">Discover and explore personal interests and hobbies for growth</p>
      </div>

      <div className="interests-container">
        {!showQuiz ? (
          <>
            <div className="interests-intro">
              <div className="intro-card">
                <h3 className="h3">Explore Your Interests</h3>
                <p>
                  This explorer helps you discover and track personal interests and hobbies. 
                  Exploring new activities can lead to:
                </p>
                <ul className="benefits-list">
                  <li>🎯 <strong>Personal Growth</strong> - Develop new skills and expand your horizons</li>
                  <li>🤝 <strong>Social Connection</strong> - Meet like-minded people and build communities</li>
                  <li>😊 <strong>Joy & Fulfillment</strong> - Find activities that bring happiness and meaning</li>
                  <li>🧠 <strong>Mental Wellness</strong> - Reduce stress and improve overall well-being</li>
                </ul>
                <button className="btn" onClick={startQuiz}>
                  Take Interest Quiz
                </button>
              </div>
            </div>

            <div className="categories-grid">
              {interestsDatabase.map(category => (
                <div
                  key={category.id}
                  className="category-card"
                  onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                >
                  <div className="category-header">
                    <span className="category-icon">{category.icon}</span>
                    <div className="category-info">
                      <h3 className="category-name">{category.name}</h3>
                      <p className="category-description">{category.description}</p>
                      <span className="category-difficulty">{category.difficulty}</span>
                    </div>
                  </div>
                  
                  {selectedCategory === category.id && (
                    <div className="activities-list">
                      {category.activities.map(activity => {
                        const preference = getPreferenceForActivity(activity.id);
                        return (
                          <div key={activity.id} className="activity-item">
                            <div className="activity-info">
                              <h4 className="activity-name">{activity.name}</h4>
                              <p className="activity-description">{activity.description}</p>
                              <button
                                className="btn btn-small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentActivity(activity);
                                }}
                              >
                                Learn More
                              </button>
                            </div>
                            <div className="preference-buttons">
                              <button
                                className={`preference-btn ${preference === 'interested' ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updatePreference(activity.id, 'interested');
                                }}
                              >
                                ❤️ Interested
                              </button>
                              <button
                                className={`preference-btn ${preference === 'curious' ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updatePreference(activity.id, 'curious');
                                }}
                              >
                                🤔 Curious
                              </button>
                              <button
                                className={`preference-btn ${preference === 'notInterested' ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updatePreference(activity.id, 'notInterested');
                                }}
                              >
                                🚫 Not Interested
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="quiz-container">
            <div className="quiz-progress">
              <div 
                className="quiz-progress-bar" 
                style={{ width: `${((quizStep + 1) / getAllActivities().length) * 100}%` }}
              />
            </div>
            
            <div className="quiz-card">
              {(() => {
                const activity = getAllActivities()[quizStep];
                return (
                  <div>
                    <h3 className="quiz-question">How do you feel about {activity.name}?</h3>
                    <p className="quiz-description">{activity.description}</p>
                    
                    <div className="quiz-options">
                      <button
                        className="quiz-option"
                        onClick={() => {
                          updatePreference(activity.id, 'interested');
                          nextQuizStep();
                        }}
                      >
                        ❤️ Very Interested
                      </button>
                      <button
                        className="quiz-option"
                        onClick={() => {
                          updatePreference(activity.id, 'curious');
                          nextQuizStep();
                        }}
                      >
                        🤔 Curious to Try
                      </button>
                      <button
                        className="quiz-option"
                        onClick={() => {
                          updatePreference(activity.id, 'notInterested');
                          nextQuizStep();
                        }}
                      >
                        🚫 Not My Thing
                      </button>
                    </div>
                    
                    <div className="quiz-navigation">
                      <span>{quizStep + 1} of {getAllActivities().length}</span>
                      <button className="btn btn-small" onClick={nextQuizStep}>
                        Skip
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {currentActivity && (
        <div className="activity-modal" onClick={() => setCurrentActivity(null)}>
          <div className="activity-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="activity-modal-header">
              <h2>{currentActivity.name}</h2>
              <button onClick={() => setCurrentActivity(null)}>×</button>
            </div>
            <div className="activity-modal-body">
              <p>{currentActivity.description}</p>
              
              <h4>Getting Started Tips</h4>
              <ul>
                {currentActivity.gettingStartedTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
              
              <h4>Practice Notes</h4>
              <ul>
                {currentActivity.practiceNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}