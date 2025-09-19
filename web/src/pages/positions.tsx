import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/Icon';

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  benefits: string[];
  tips: string[];
  illustration: string;
  wellnessLevel: number; // 1-5 scale
  practiceNotes: string[];
  isTriedBy?: { user1: boolean; user2: boolean };
  isWishlisted?: { user1: boolean; user2: boolean };
}

// Wellness and exercise database with mindfulness and fitness practices
const exerciseDatabase: Exercise[] = [
  {
    id: '1',
    name: 'Partner Breathing Exercise',
    description: 'A calming breathing exercise that promotes relaxation and connection. Perfect for stress relief and mindfulness practice.',
    category: 'Mindfulness & Relaxation',
    difficulty: 'Beginner',
    benefits: ['Reduces stress and anxiety', 'Improves focus', 'Enhances emotional connection', 'Easy to practice anywhere'],
    tips: ['Find a quiet, comfortable space', 'Sit facing each other', 'Breathe slowly and deeply', 'Maintain gentle eye contact'],
    practiceNotes: ['Practice for 5-10 minutes daily', 'Focus on synchronizing breath', 'Notice how you feel before and after', 'Use this as a daily check-in'],
    illustration: 'heart-embrace',
    wellnessLevel: 5
  },
  {
    id: '2',
    name: 'Morning Stretching Routine',
    description: 'A gentle stretching sequence to start your day with energy and flexibility. Includes basic yoga poses and mobility exercises.',
    category: 'Flexibility & Movement',
    difficulty: 'Beginner',
    benefits: ['Improves flexibility', 'Reduces muscle tension', 'Boosts morning energy', 'Prevents injury'],
    tips: ['Start slowly and gently', 'Hold each stretch for 30 seconds', 'Focus on breath while stretching', 'Listen to your body'],
    practiceNotes: ['Perfect for lazy mornings', 'Can be done in bed or on a mat', 'Great for partner encouragement', 'Builds healthy habits'],
    illustration: 'crescent-moon',
    wellnessLevel: 4
  },
  {
    id: '3',
    name: 'Partner Strength Training',
    description: 'Bodyweight exercises that can be done with a partner for motivation and support. Includes squats, planks, and resistance exercises.',
    category: 'Strength & Fitness',
    difficulty: 'Intermediate',
    benefits: ['Builds muscle strength', 'Improves cardiovascular health', 'Partner motivation', 'Fun and engaging workout'],
    tips: ['Start with bodyweight exercises', 'Focus on proper form', 'Take turns counting reps', 'Celebrate progress together'],
    practiceNotes: ['Encourage each other', 'Track progress together', 'Make it fun with music', 'Adjust difficulty as needed'],
    illustration: 'crown',
    wellnessLevel: 4
  },
  {
    id: '4',
    name: 'Balance Challenge',
    description: 'Advanced balance exercises that challenge stability and core strength. Great for improving coordination and body awareness.',
    category: 'Balance & Coordination',
    difficulty: 'Advanced',
    benefits: ['Improves balance and coordination', 'Strengthens core muscles', 'Enhances body awareness', 'Builds confidence'],
    tips: ['Start with wall support', 'Focus on a fixed point', 'Engage your core', 'Progress gradually'],
    practiceNotes: ['Safety first - use support when needed', 'Practice regularly for improvement', 'Track balance improvements', 'Challenge yourself appropriately'],
    illustration: 'mountain-peak',
    wellnessLevel: 3
  },
  {
    id: '5',
    name: 'Nature Walk Meditation',
    description: 'A mindful walking practice that combines light exercise with meditation. Focus on connecting with nature and being present.',
    category: 'Mindful Movement',
    difficulty: 'Beginner',
    benefits: ['Combines exercise with mindfulness', 'Reduces stress', 'Connects you with nature', 'Gentle cardiovascular exercise'],
    tips: ['Choose a peaceful location', 'Walk at a comfortable pace', 'Focus on your surroundings', 'Leave devices behind'],
    practiceNotes: ['Discuss what you notice', 'Practice gratitude', 'Share peaceful moments', 'Make it a regular habit'],
    illustration: 'blooming-flower',
    wellnessLevel: 5
  },
  {
    id: '6',
    name: 'Dance Movement',
    description: 'Free-form dance movement that promotes self-expression and cardiovascular health. No experience required - just move to the music.',
    category: 'Creative Expression',
    difficulty: 'Beginner',
    benefits: ['Improves cardiovascular health', 'Boosts mood and confidence', 'Enhances creativity', 'Fun and stress-relieving'],
    tips: ['Choose music you love', 'Move however feels good', 'Don\'t worry about technique', 'Focus on having fun'],
    practiceNotes: ['Express yourself freely', 'Share favorite music', 'Encourage each other', 'Celebrate movement'],
    illustration: 'butterfly',
    wellnessLevel: 4
  },
  {
    id: '7',
    name: 'Progressive Relaxation',
    description: 'A systematic relaxation technique that involves tensing and releasing different muscle groups. Excellent for stress relief.',
    category: 'Stress Relief',
    difficulty: 'Beginner',
    benefits: ['Deep physical relaxation', 'Reduces muscle tension', 'Improves sleep quality', 'Manages stress and anxiety'],
    tips: ['Find a quiet environment', 'Start with breathing', 'Tense and release gradually', 'Notice the difference'],
    practiceNotes: ['Practice regularly for best results', 'Use guided audio if helpful', 'Check in with each other', 'Notice improvements over time'],
    illustration: 'wave',
    wellnessLevel: 4
  },
  {
    id: '8',
    name: 'Evening Gratitude Practice',
    description: 'A gentle evening practice combining light stretching with gratitude reflection. Perfect way to end the day peacefully.',
    category: 'Evening Wellness',
    difficulty: 'Beginner',
    benefits: ['Promotes better sleep', 'Builds positive mindset', 'Reduces daily stress', 'Strengthens relationships'],
    tips: ['Practice before bedtime', 'Share three things you\'re grateful for', 'Include gentle stretches', 'Keep it simple'],
    practiceNotes: ['Share gratitude with your partner', 'Reflect on the day positively', 'Create a calming environment', 'Make it a nightly ritual'],
    illustration: 'star',
    wellnessLevel: 5
  }
];

const categories = ['All', 'Mindfulness & Relaxation', 'Flexibility & Movement', 'Strength & Fitness', 'Balance & Coordination', 'Mindful Movement', 'Creative Expression', 'Stress Relief', 'Evening Wellness'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Wellness() {
  const [exercises, setExercises] = useState<Exercise[]>(exerciseDatabase);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtered = exerciseDatabase;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.benefits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setExercises(filtered);
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'var(--neon)';
      case 'Intermediate': return 'var(--gold)';
      case 'Advanced': return 'var(--rose)';
      default: return 'var(--ink-secondary)';
    }
  };

  const getIllustrationComponent = (illustration: string) => {
    const illustrationMap: { [key: string]: JSX.Element } = {
      'heart-embrace': (
        <div style={{ 
          background: 'linear-gradient(135deg, var(--rose), var(--accent))',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="heart" size={32} color="white" />
          </div>
        </div>
      ),
      'crescent-moon': (
        <div style={{ 
          background: 'linear-gradient(135deg, var(--accent), var(--plum))',
          borderRadius: '60% 40%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <Icon name="moon" size={28} color="white" />
        </div>
      ),
      'crown': (
        <div style={{ 
          background: 'linear-gradient(135deg, var(--gold), var(--accent))',
          clipPath: 'polygon(0% 100%, 20% 0%, 40% 50%, 60% 0%, 80% 50%, 100% 0%, 100% 100%)',
          width: '80px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '10px 0'
        }}>
          <Icon name="star" size={24} color="white" />
        </div>
      ),
      'mountain-peak': (
        <div style={{ 
          background: 'linear-gradient(135deg, var(--plum), var(--navy))',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          width: '80px',
          height: '70px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '10px'
        }}>
          <Icon name="sparkles" size={20} color="white" />
        </div>
      ),
      'blooming-flower': (
        <div style={{ 
          background: 'linear-gradient(135deg, var(--rose), var(--accent))',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon name="flower" size={28} color="white" />
        </div>
      ),
      'butterfly': (
        <div style={{ 
          background: 'linear-gradient(135deg, var(--accent), var(--neon))',
          borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%',
          width: '80px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon name="sparkles" size={24} color="white" />
        </div>
      ),
      'wave': (
        <div style={{ 
          background: 'linear-gradient(135deg, var(--accent), var(--plum))',
          borderRadius: '0 100% 0 100%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon name="sparkles" size={24} color="white" />
        </div>
      ),
      'star': (
        <div style={{ 
          background: 'linear-gradient(135deg, var(--gold), var(--accent))',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon name="star" size={24} color="white" />
        </div>
      )
    };

    return illustrationMap[illustration] || (
      <div style={{ 
        background: 'linear-gradient(135deg, var(--accent), var(--plum))',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon name="flower" size={28} color="white" />
      </div>
    );
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Wellness & Exercise Explorer</h1>
        <p className="page-subtitle">Discover mindfulness practices, exercises, and wellness activities for better health</p>
      </div>

      <div className="exercises-container">
        <div className="exercises-filters">
          <div className="filter-group">
            <label className="filter-label">Search exercises</label>
            <input
              type="text"
              placeholder="Search by name, description, or benefits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Experience Level</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="exercises-grid">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="exercise-card"
              onClick={() => setSelectedExercise(exercise)}
            >
              <div className="exercise-illustration">
                {getIllustrationComponent(exercise.illustration)}
              </div>
              <div className="exercise-info">
                <h3 className="exercise-name">{exercise.name}</h3>
                <p className="exercise-category">{exercise.category}</p>
                <div className="exercise-meta">
                  <div 
                    className="exercise-difficulty"
                    style={{ color: getDifficultyColor(exercise.difficulty) }}
                  >
                    {exercise.difficulty}
                  </div>
                  <div className="wellness-level">
                    {Array.from({ length: exercise.wellnessLevel }).map((_, i) => (
                      <Icon key={i} name="star" size={12} color="var(--gold)" style={{ marginRight: '2px' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {exercises.length === 0 && (
          <div className="empty-state">
            <Icon name="search" size={64} color="var(--accent)" className="empty-icon" />
            <h3 className="h3">No exercises found</h3>
            <p className="sub">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {selectedExercise && (
        <div className="exercise-modal" onClick={() => setSelectedExercise(null)}>
          <div className="exercise-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="exercise-modal-header">
              <div className="exercise-modal-illustration">
                {getIllustrationComponent(selectedExercise.illustration)}
              </div>
              <div>
                <h2 className="exercise-modal-title">{selectedExercise.name}</h2>
                <div className="exercise-modal-meta">
                  <span className="exercise-modal-category">{selectedExercise.category}</span>
                  <span 
                    className="exercise-modal-difficulty"
                    style={{ color: getDifficultyColor(selectedExercise.difficulty) }}
                  >
                    {selectedExercise.difficulty}
                  </span>
                  <div className="wellness-stars">
                    {Array.from({ length: selectedExercise.wellnessLevel }).map((_, i) => (
                      <Icon key={i} name="star" size={14} color="var(--gold)" style={{ marginRight: '2px' }} />
                    ))}
                  </div>
                </div>
              </div>
              <button 
                className="exercise-modal-close"
                onClick={() => setSelectedExercise(null)}
              >
                <Icon name="close" size={20} color="var(--ink)" />
              </button>
            </div>

            <div className="exercise-modal-body">
              <div className="exercise-description">
                <h4>About This Practice</h4>
                <p>{selectedExercise.description}</p>
              </div>

              <div className="exercise-benefits">
                <h4>Health Benefits</h4>
                <ul>
                  {selectedExercise.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="exercise-tips">
                <h4>Practice Tips</h4>
                <ul>
                  {selectedExercise.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="exercise-notes">
                <h4>Practice Notes</h4>
                <ul>
                  {selectedExercise.practiceNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="exercise-modal-footer">
              <p className="exercise-disclaimer">
                <Icon name="star" size={16} color="var(--gold)" style={{ marginRight: '8px' }} />
                Remember: Listen to your body, start slowly, and consult healthcare providers for any concerns. 
                Focus on consistency and gradual progress for best results.
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
