import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface Position {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  tags: string[];
  duration?: number;
  views?: number;
}

interface PositionCategory {
  id: string;
  name: string;
  description: string;
  searchTags: string[];
}

// Position categories for RedGifs content
const positionCategories: PositionCategory[] = [
  {
    id: 'romantic',
    name: 'Romantic & Intimate',
    description: 'Tender, loving positions focused on connection',
    searchTags: ['romantic', 'intimate', 'loving', 'tender']
  },
  {
    id: 'passionate',
    name: 'Passionate & Intense',
    description: 'Energetic and passionate intimate positions',
    searchTags: ['passionate', 'intense', 'energetic']
  },
  {
    id: 'creative',
    name: 'Creative & Adventurous',
    description: 'Unique and adventurous intimate experiences',
    searchTags: ['creative', 'adventurous', 'unique']
  },
  {
    id: 'sensual',
    name: 'Sensual & Slow',
    description: 'Slow, sensual, and deeply connected experiences',
    searchTags: ['sensual', 'slow', 'connected']
  }
];

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('romantic');
  const [error, setError] = useState<string | null>(null);
  const [apiEnabled, setApiEnabled] = useState(false);

  useEffect(() => {
    checkApiStatus();
  }, []);

  useEffect(() => {
    if (apiEnabled) {
      loadPositions();
    }
  }, [selectedCategory, apiEnabled]);

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/settings');
      const settings = await response.json();
      setApiEnabled(settings.enableRedGifs && settings.redgifsToken);
    } catch (e) {
      setApiEnabled(false);
    }
  };

  const loadPositions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const category = positionCategories.find(c => c.id === selectedCategory);
      const searchTag = category?.searchTags[0] || 'romantic';
      
      const response = await fetch(`/api/positions/redgifs?tag=${searchTag}&count=20`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setPositions([]);
      } else {
        setPositions(data.items || []);
      }
    } catch (e) {
      setError('Failed to load content. Please check your connection.');
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  if (!apiEnabled) {
    return (
      <Layout>
        <div className="page-header">
          <h1 className="page-title">Intimate Positions</h1>
          <p className="page-subtitle">Explore intimate positions and experiences together</p>
        </div>

        <div className="consent-container">
          <div className="consent-card">
            <h3>Content Not Available</h3>
            <p>RedGifs integration is not enabled or configured.</p>
            <p>Please contact your administrator to:</p>
            <ul className="consent-principles">
              <li>Enable RedGifs integration in Admin settings</li>
              <li>Configure a valid RedGifs API token</li>
            </ul>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Intimate Positions</h1>
        <p className="page-subtitle">Explore intimate positions and experiences together</p>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {positionCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={loadPositions} 
          className="btn"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-card">
          <h3>Unable to Load Content</h3>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <p>Loading intimate content...</p>
        </div>
      )}

      {!loading && !error && positions.length === 0 && (
        <div className="empty-state">
          <h3>No Content Available</h3>
          <p>No positions found for this category. Try refreshing or selecting a different category.</p>
        </div>
      )}

      <div className="positions-grid">
        {positions.map(position => (
          <div key={position.id} className="position-card">
            <div className="position-media">
              <img 
                src={position.thumbnail} 
                alt={position.title}
                loading="lazy"
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <div className="position-info">
              <h3>{position.title}</h3>
              <div className="position-tags">
                {position.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              {position.views && (
                <div className="position-stats">
                  {position.views.toLocaleString()} views
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}