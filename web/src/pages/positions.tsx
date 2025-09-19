import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/Icon';

interface Position {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  benefits: string[];
  tips: string[];
  illustration: string;
  intimacyLevel: number; // 1-5 scale
  communicationTips: string[];
  isTriedBy?: { user1: boolean; user2: boolean };
  isWishlisted?: { user1: boolean; user2: boolean };
}

// Premium educational position database with tasteful abstract representations
const positionsDatabase: Position[] = [
  {
    id: '1',
    name: 'The Eternal Embrace',
    description: 'A tender, soul-connecting position that prioritizes emotional intimacy and profound connection. Perfect for slow, meaningful moments that transcend the physical.',
    category: 'Soul Connection',
    difficulty: 'Beginner',
    benefits: ['Deep emotional bonding', 'Full body intimacy', 'Enhanced communication', 'Comfortable for extended connection'],
    tips: ['Maintain loving eye contact', 'Synchronize your breathing', 'Take your time to explore', 'Use soft pillows for comfort'],
    communicationTips: ['Share what feels amazing', 'Express your emotions openly', 'Check in frequently', 'Use gentle touches to communicate'],
    illustration: 'heart-embrace',
    intimacyLevel: 5
  },
  {
    id: '2',
    name: 'Morning Sanctuary',
    description: 'A side-by-side sanctuary that offers comfort, closeness, and endless caressing possibilities. Ideal for lazy mornings and tender evenings.',
    category: 'Comfort & Care',
    difficulty: 'Beginner',
    benefits: ['Deeply relaxing', 'Perfect for cuddling', 'Allows sensual touch', 'Low effort, high intimacy'],
    tips: ['Adjust angles for perfect fit', 'Use hands for gentle exploration', 'Try different leg positions', 'Perfect for aftercare moments'],
    communicationTips: ['Whisper sweet affirmations', 'Share your favorite sensations', 'Express gratitude', 'Plan your day together'],
    illustration: 'crescent-moon',
    intimacyLevel: 4
  },
  {
    id: '3',
    name: 'Throne of Passion',
    description: 'A regal seated position that allows for equal participation and exquisite rhythm control. Creates a beautiful power dynamic of shared control.',
    category: 'Empowered Unity',
    difficulty: 'Intermediate',
    benefits: ['Shared rhythm control', 'Multiple angle variations', 'Deep penetration options', 'Enhanced creativity'],
    tips: ['Choose a sturdy, comfortable seat', 'Start with gentle movements', 'Communicate rhythm preferences', 'Experiment with positions'],
    communicationTips: ['Guide each other\'s movements', 'Express what feels incredible', 'Take turns leading', 'Celebrate the connection'],
    illustration: 'crown',
    intimacyLevel: 4
  },
  {
    id: '4',
    name: 'Vertical Rapture',
    description: 'An adventurous vertical position that ignites spontaneity and primal passion. Requires trust, balance, and exquisite communication.',
    category: 'Adventure & Thrill',
    difficulty: 'Advanced',
    benefits: ['Spontaneous excitement', 'Full body engagement', 'Unique angle sensations', 'Quick passion moments'],
    tips: ['Ensure stable footing always', 'Use wall support when needed', 'Consider height differences', 'Start with shorter durations'],
    communicationTips: ['Constantly check comfort', 'Use safe words', 'Guide positioning', 'Express needs immediately'],
    illustration: 'mountain-peak',
    intimacyLevel: 3
  },
  {
    id: '5',
    name: 'Secret Garden',
    description: 'A nature-inspired position focusing on gentle exploration and mutual discovery. Emphasizes comfort, patience, and sensual awakening.',
    category: 'Exploration & Discovery',
    difficulty: 'Intermediate',
    benefits: ['Encourages slow exploration', 'Comfortable for extended play', 'Multiple pleasure points', 'Deeply intimate bonding'],
    tips: ['Create a cozy environment', 'Use luxurious soft surfaces', 'Take mindful breaks', 'Focus on sensation'],
    communicationTips: ['Describe new sensations', 'Guide exploration', 'Share fantasies', 'Express wonder'],
    illustration: 'blooming-flower',
    intimacyLevel: 5
  },
  {
    id: '6',
    name: 'Butterfly Dance',
    description: 'An elegant position that allows for graceful movement and rhythmic poetry. Creates a sense of floating together in perfect harmony.',
    category: 'Artistic Expression',
    difficulty: 'Intermediate',
    benefits: ['Graceful, flowing movement', 'Unique sensual experiences', 'Artistic and beautiful', 'Perfect rhythm synchronization'],
    tips: ['Move with slow grace', 'Focus on the flowing connection', 'Use music for inspiration', 'Practice patience and presence'],
    communicationTips: ['Share the rhythm', 'Express the beauty you feel', 'Guide graceful movements', 'Celebrate the dance'],
    illustration: 'butterfly',
    intimacyLevel: 4
  },
  {
    id: '7',
    name: 'Ocean Tide',
    description: 'A flowing position inspired by the rhythm of ocean waves. Features gentle, undulating movements that build and release like natural tides.',
    category: 'Rhythm & Flow',
    difficulty: 'Intermediate',
    benefits: ['Natural rhythm building', 'Gentle intensity waves', 'Meditative connection', 'Stress release'],
    tips: ['Follow natural breathing', 'Build intensity gradually', 'Allow natural pauses', 'Focus on the flow'],
    communicationTips: ['Share the rhythm building', 'Express when waves feel perfect', 'Guide the tide together', 'Breathe as one'],
    illustration: 'wave',
    intimacyLevel: 4
  },
  {
    id: '8',
    name: 'Starlight Connection',
    description: 'A celestial-inspired position perfect for nighttime intimacy. Features gentle angles and soft movements under the cover of darkness.',
    category: 'Nighttime Romance',
    difficulty: 'Beginner',
    benefits: ['Perfect for nighttime', 'Gentle and quiet', 'Romantic atmosphere', 'Easy transition to sleep'],
    tips: ['Dim lighting preferred', 'Soft, quiet movements', 'Focus on gentle touches', 'Perfect before sleep'],
    communicationTips: ['Whisper sweet words', 'Share bedtime thoughts', 'Express love softly', 'Plan tomorrow together'],
    illustration: 'star',
    intimacyLevel: 5
  }
];

const categories = ['All', 'Soul Connection', 'Comfort & Care', 'Empowered Unity', 'Adventure & Thrill', 'Exploration & Discovery', 'Artistic Expression', 'Rhythm & Flow', 'Nighttime Romance'];
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
        <h1 className="page-title">Intimate Positions Explorer</h1>
        <p className="page-subtitle">Educational guide to passionate connection and soulful intimacy</p>
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

        <div className="positions-grid">
          {positions.map((position) => (
            <div
              key={position.id}
              className="position-card"
              onClick={() => setSelectedPosition(position)}
            >
              <div className="position-illustration">
                {getIllustrationComponent(position.illustration)}
              </div>
              <div className="position-info">
                <h3 className="position-name">{position.name}</h3>
                <p className="position-category">{position.category}</p>
                <div className="position-meta">
                  <div 
                    className="position-difficulty"
                    style={{ color: getDifficultyColor(position.difficulty) }}
                  >
                    {position.difficulty}
                  </div>
                  <div className="intimacy-level">
                    {Array.from({ length: position.intimacyLevel }).map((_, i) => (
                      <Icon key={i} name="heart" size={12} color="var(--rose)" style={{ marginRight: '2px' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {positions.length === 0 && (
          <div className="empty-state">
            <Icon name="search" size={64} color="var(--accent)" className="empty-icon" />
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
                {getIllustrationComponent(selectedPosition.illustration)}
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
                  <div className="intimacy-stars">
                    {Array.from({ length: selectedPosition.intimacyLevel }).map((_, i) => (
                      <Icon key={i} name="heart" size={14} color="var(--rose)" style={{ marginRight: '2px' }} />
                    ))}
                  </div>
                </div>
              </div>
              <button 
                className="position-modal-close"
                onClick={() => setSelectedPosition(null)}
              >
                <Icon name="close" size={20} color="var(--ink)" />
              </button>
            </div>

            <div className="position-modal-body">
              <div className="position-description">
                <h4>Beautiful Description</h4>
                <p>{selectedPosition.description}</p>
              </div>

              <div className="position-benefits">
                <h4>Intimate Benefits</h4>
                <ul>
                  {selectedPosition.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="position-tips">
                <h4>Tips for Blissful Connection</h4>
                <ul>
                  {selectedPosition.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="position-communication">
                <h4>Communication & Care</h4>
                <ul>
                  {selectedPosition.communicationTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="position-modal-footer">
              <p className="position-disclaimer">
                <Icon name="heart" size={16} color="var(--rose)" style={{ marginRight: '8px' }} />
                Remember: Communication, consent, and comfort are the foundation of all beautiful intimate moments. 
                Go at your own pace and prioritize each other's wellbeing above all.
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
