import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface Position {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  benefits: string[];
  tips: string[];
  illustration: string;
}

// Educational position database
const positionsDatabase: Position[] = [
  {
    id: '1',
    name: 'The Embrace',
    description: 'A tender, face-to-face position that prioritizes emotional intimacy and gentle connection. Perfect for slow, meaningful moments together.',
    category: 'Intimate',
    difficulty: 'Beginner',
    benefits: ['Deep emotional connection', 'Full body contact', 'Easy communication', 'Comfortable for both partners'],
    tips: ['Maintain eye contact', 'Focus on synchronized breathing', 'Take your time', 'Use pillows for support'],
    illustration: '💕'
  },
  {
    id: '2',
    name: 'Spooning Connection',
    description: 'A side-by-side position that offers comfort, closeness, and the ability to caress. Ideal for lazy mornings or intimate evenings.',
    category: 'Comfort',
    difficulty: 'Beginner',
    benefits: ['Relaxing and comfortable', 'Great for cuddling', 'Allows for gentle touch', 'Low energy requirement'],
    tips: ['Adjust angle for comfort', 'Use your hands to explore', 'Try different leg positions', 'Perfect for aftercare'],
    illustration: '🤗'
  },
  {
    id: '3',
    name: 'Seated Unity',
    description: 'A versatile seated position that allows for equal participation and easy rhythm control. Great for deeper connection.',
    category: 'Versatile',
    difficulty: 'Intermediate',
    benefits: ['Shared control', 'Different angles', 'Good for rhythm variety', 'Allows for creative movement'],
    tips: ['Use a sturdy chair or surface', 'Start slowly', 'Communicate preferences', 'Try different seating arrangements'],
    illustration: '💺'
  },
  {
    id: '4',
    name: 'Standing Embrace',
    description: 'An adventurous standing position that can add excitement and spontaneity. Requires good balance and communication.',
    category: 'Adventurous',
    difficulty: 'Advanced',
    benefits: ['Spontaneous and exciting', 'Full body engagement', 'Different sensations', 'Good for quick moments'],
    tips: ['Ensure stable footing', 'Use wall support if needed', 'Height difference considerations', 'Start with shorter durations'],
    illustration: '🕴️'
  },
  {
    id: '5',
    name: 'The Garden',
    description: 'A nature-inspired position focusing on gentle exploration and mutual pleasure. Emphasizes comfort and discovery.',
    category: 'Exploratory',
    difficulty: 'Intermediate',
    benefits: ['Encourages exploration', 'Comfortable for extended time', 'Multiple contact points', 'Very intimate'],
    tips: ['Create a comfortable environment', 'Use soft surfaces', 'Take breaks as needed', 'Focus on sensation'],
    illustration: '🌸'
  },
  {
    id: '6',
    name: 'Butterfly Wings',
    description: 'An elegant position that allows for beautiful movement and rhythm. Creates a sense of floating together.',
    category: 'Elegant',
    difficulty: 'Intermediate',
    benefits: ['Graceful movement', 'Unique sensations', 'Artistic and beautiful', 'Good for rhythm play'],
    tips: ['Move slowly and gracefully', 'Focus on the flow', 'Use music for inspiration', 'Practice patience'],
    illustration: '🦋'
  }
];

const categories = ['All', 'Intimate', 'Comfort', 'Versatile', 'Adventurous', 'Exploratory', 'Elegant'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Positions() {
  const [positions, setPositions] = useState<Position[]>(positionsDatabase);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtered = positionsDatabase;

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

    setPositions(filtered);
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4ade80';
      case 'Intermediate': return '#fbbf24';
      case 'Advanced': return '#f87171';
      default: return '#94a3b8';
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Positions Explorer</h1>
        <p className="page-subtitle">Educational guide to intimate positions and connection</p>
      </div>

      <div className="positions-container">
        <div className="positions-filters">
          <div className="filter-group">
            <label className="filter-label">Search positions</label>
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
            <label className="filter-label">Difficulty</label>
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

        <div className="positions-grid">
          {positions.map((position) => (
            <div
              key={position.id}
              className="position-card"
              onClick={() => setSelectedPosition(position)}
            >
              <div className="position-illustration">
                {position.illustration}
              </div>
              <div className="position-info">
                <h3 className="position-name">{position.name}</h3>
                <p className="position-category">{position.category}</p>
                <div 
                  className="position-difficulty"
                  style={{ color: getDifficultyColor(position.difficulty) }}
                >
                  {position.difficulty}
                </div>
              </div>
            </div>
          ))}
        </div>

        {positions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="h3">No positions found</h3>
            <p className="sub">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {selectedPosition && (
        <div className="position-modal" onClick={() => setSelectedPosition(null)}>
          <div className="position-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="position-modal-header">
              <div className="position-modal-illustration">
                {selectedPosition.illustration}
              </div>
              <div>
                <h2 className="position-modal-title">{selectedPosition.name}</h2>
                <div className="position-modal-meta">
                  <span className="position-modal-category">{selectedPosition.category}</span>
                  <span 
                    className="position-modal-difficulty"
                    style={{ color: getDifficultyColor(selectedPosition.difficulty) }}
                  >
                    {selectedPosition.difficulty}
                  </span>
                </div>
              </div>
              <button 
                className="position-modal-close"
                onClick={() => setSelectedPosition(null)}
              >
                ✕
              </button>
            </div>

            <div className="position-modal-body">
              <div className="position-description">
                <h4>Description</h4>
                <p>{selectedPosition.description}</p>
              </div>

              <div className="position-benefits">
                <h4>Benefits</h4>
                <ul>
                  {selectedPosition.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="position-tips">
                <h4>Tips for Success</h4>
                <ul>
                  {selectedPosition.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="position-modal-footer">
              <p className="position-disclaimer">
                💝 Remember: Communication, consent, and comfort are always most important. 
                Go at your own pace and prioritize each other's wellbeing.
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
