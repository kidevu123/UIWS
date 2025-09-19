import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";

import { THEME_PACKS } from "@/lib/themes";

export default function Admin(){
  const [settings, setSettings] = useState<any>({});
  const [health, setHealth] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    Promise.all([
      fetch("/api/settings").then(r=>r.json()).catch(()=>({})),
      fetch("/api/health/all").then(r=>r.json()).catch(()=>null)
    ]).then(([settingsData, healthData]) => {
      setSettings(settingsData || {});
      setHealth(healthData);
    }).catch((err) => {
      setError("Failed to load admin data. Backend may not be available.");
      console.error("Admin load error:", err);
    }).finally(() => {
      setLoading(false);
    });
  },[]);

  const save = async () => {
    try {
      setSaved(false);
      const response = await fetch("/api/settings", { 
        method:"POST", 
        headers:{"Content-Type":"application/json"}, 
        body: JSON.stringify(settings) 
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(()=>setSaved(false), 3000);
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (err) {
      setError("Failed to save settings. Please try again.");
      console.error("Save error:", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div className="loading-spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Admin Settings</h1>
        <p className="page-subtitle">Complete control over your wellness platform</p>
      </div>

      {error && (
        <div className="error-message">
          <Icon name="exclamation" size={20} style={{ marginRight: '8px' }} />
          {error}
        </div>
      )}
      
      {/* Theme & Personalization */}
      <div className="card">
        <div className="card-header">
          <h3 className="h3">
            <Icon name="sparkles" size={24} color="var(--accent)" style={{ marginRight: '12px' }} />
            Theme & Personalization
          </h3>
          <p className="card-subtitle">Customize the look and feel of your platform</p>
        </div>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Visual Theme
            </label>
            <select 
              value={settings.theme || "sultry-velvet"} 
              onChange={e=>setSettings({...settings, theme: e.target.value})}
              style={{ width: '100%' }}
            >
              {Object.entries(THEME_PACKS).map(([k,v]:any)=>(
                <option value={k} key={k}>{v.name}</option>
              ))}
            </select>
            <p className="sub">Each theme provides different fonts, colors, and mood</p>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Personal Details
            </label>
            <div className="grid">
              <input 
                placeholder="Anniversary date" 
                type="date" 
                value={settings.anniversary || ''} 
                onChange={e=>setSettings({...settings, anniversary: e.target.value})} 
              />
              <select
                value={settings.timeZone || "America/New_York"}
                onChange={e=>setSettings({...settings, timeZone: e.target.value})}
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={!!settings.bg_music} 
                onChange={e=>setSettings({...settings, bg_music: e.target.checked})} 
              />
              <span>Gentle background music</span>
            </label>
          </div>
        </div>
      </div>

      {/* AI Configuration */}
      <div className="card">
        <div className="card-header">
          <h3 className="h3">
            <Icon name="brain" size={24} color="var(--accent-secondary)" style={{ marginRight: '12px' }} />
            AI Assistant Configuration
          </h3>
          <p className="card-subtitle">Configure your personal AI companion's personality and capabilities</p>
        </div>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              AI Model
            </label>
            <input 
              placeholder="e.g., llama3.1:8b-instruct, mixtral:8x7b" 
              value={settings.defaultModel || ""} 
              onChange={e=>setSettings({...settings, defaultModel:e.target.value})} 
            />
            <p className="sub">Specify which LLM model to use (must be available in Ollama)</p>
          </div>

          <div className="grid">
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Response Style
              </label>
              <select 
                value={settings.aiTone || "empathetic"} 
                onChange={e=>setSettings({...settings, aiTone: e.target.value})}
              >
                <option value="empathetic">Empathetic - Caring and understanding</option>
                <option value="romantic">Romantic - Tender and loving</option>
                <option value="playful">Playful - Light-hearted and fun</option>
                <option value="professional">Professional - Formal and informative</option>
                <option value="casual">Casual - Friendly and relaxed</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Content Level
              </label>
              <select 
                value={settings.aiExplicitness || "moderate"} 
                onChange={e=>setSettings({...settings, aiExplicitness: e.target.value})}
              >
                <option value="conservative">Conservative - Family-friendly only</option>
                <option value="moderate">Moderate - Tasteful adult topics</option>
                <option value="open">Open - Frank adult discussions</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Custom System Prompt
            </label>
            <textarea 
              placeholder="Add custom instructions for your AI companion..."
              value={settings.aiSystemPrompt || ""} 
              onChange={e=>setSettings({...settings, aiSystemPrompt: e.target.value})}
              rows={4}
              style={{width: '100%'}}
            />
            <p className="sub">Override default personality with specific instructions</p>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={!!settings.aiMemoryEnabled} 
                onChange={e=>setSettings({...settings, aiMemoryEnabled: e.target.checked})} 
              />
              <span>Enable conversation memory across sessions</span>
            </label>
          </div>
        </div>
      </div>

      {/* API Integrations */}
      <div className="card">
        <div className="card-header">
          <h3 className="h3">
            <Icon name="settings" size={24} color="var(--accent-tertiary)" style={{ marginRight: '12px' }} />
            External API Integrations
          </h3>
          <p className="card-subtitle">Connect external services for enhanced functionality</p>
        </div>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              <Icon name="eye" size={16} style={{ marginRight: '6px' }} />
              Content APIs
            </label>
            <div style={{ display: 'grid', gap: '12px' }}>
              <input 
                type="password"
                placeholder="RedGifs OAuth token for wellness content" 
                value={settings.redgifsToken || ""} 
                onChange={e=>setSettings({...settings, redgifsToken:e.target.value})} 
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={!!settings.enableRedGifs} 
                  onChange={e=>setSettings({...settings, enableRedGifs: e.target.checked})} 
                />
                <span>Enable RedGifs integration</span>
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              <Icon name="heart" size={16} style={{ marginRight: '6px' }} />
              Device Integration
            </label>
            <div style={{ display: 'grid', gap: '12px' }}>
              <input 
                type="password"
                placeholder="Lovense developer token" 
                value={settings.lovenseToken || ""} 
                onChange={e=>setSettings({...settings, lovenseToken:e.target.value})} 
              />
              <input 
                placeholder="Lovense user identifier" 
                value={settings.lovenseUid || ""} 
                onChange={e=>setSettings({...settings, lovenseUid:e.target.value})} 
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={!!settings.enableLovense} 
                  onChange={e=>setSettings({...settings, enableLovense: e.target.checked})} 
                />
                <span>Enable Lovense device control</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="card">
        <div className="card-header">
          <h3 className="h3">
            <Icon name="check" size={24} color="#4ade80" style={{ marginRight: '12px' }} />
            System Health & Status
          </h3>
          <p className="card-subtitle">Monitor the health of all platform components</p>
        </div>
        
        {!health ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Icon name="exclamation" size={32} color="var(--accent)" style={{ marginBottom: '12px' }} />
            <p>Unable to check system health - backend may not be available</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {Object.entries(health.checks || {}).map(([k,v]: any)=> (
              <div key={k} className="card" style={{ 
                background: v.ok ? 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(34,197,94,0.05))' : 'linear-gradient(135deg, rgba(248,113,113,0.1), rgba(239,68,68,0.05))',
                border: `1px solid ${v.ok ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Icon 
                    name={v.ok ? "check" : "exclamation"} 
                    size={18} 
                    color={v.ok ? "#4ade80" : "#f87171"}
                  />
                  <strong>{k}</strong>
                </div>
                <div className="sub">{v.message || (v.ok ? "Service is running normally" : "Service has issues")}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="card-header">
          <h3 className="h3">
            <Icon name="lock" size={24} color="var(--gold)" style={{ marginRight: '12px' }} />
            Data & Privacy Management
          </h3>
          <p className="card-subtitle">Backup and notification settings</p>
        </div>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <a className="btn btn-secondary" href="/api/luxury/backup.zip">
              <Icon name="star" size={18} style={{ marginRight: '8px' }} />
              Download Encrypted Backup
            </a>
            <p className="sub">Download a secure backup of all your data</p>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
              Email Notifications (Optional)
            </label>
            <div className="grid">
              <input placeholder="SMTP server host" value={settings.smtp_host || ""} onChange={e=>setSettings({...settings, smtp_host:e.target.value})} />
              <input placeholder="SMTP port (587)" value={settings.smtp_port || ""} onChange={e=>setSettings({...settings, smtp_port:e.target.value})} />
              <input placeholder="SMTP username" value={settings.smtp_user || ""} onChange={e=>setSettings({...settings, smtp_user:e.target.value})} />
              <input placeholder="SMTP password" type="password" value={settings.smtp_pass || ""} onChange={e=>setSettings({...settings, smtp_pass:e.target.value})} />
              <input placeholder="From email address" value={settings.smtp_from || ""} onChange={e=>setSettings({...settings, smtp_from:e.target.value})} />
              <input placeholder="Notification email" value={settings.notify_email || ""} onChange={e=>setSettings({...settings, notify_email:e.target.value})} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <input 
                type="checkbox" 
                checked={!!settings.health_notifications} 
                onChange={e=>setSettings({...settings, health_notifications: e.target.checked})} 
              />
              <span>Send periodic health notifications</span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ 
        position: 'sticky', 
        bottom: '24px', 
        background: 'var(--card)', 
        padding: '20px', 
        borderRadius: 'var(--radius-large)',
        border: '1px solid var(--stroke)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontWeight: 600 }}>Ready to save your changes?</div>
          <div className="sub">All settings will be applied immediately</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {saved && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#4ade80'
            }}>
              <Icon name="check" size={18} />
              <span>Settings saved successfully!</span>
            </div>
          )}
          <button className="btn btn-large" onClick={save}>
            <Icon name="star" size={18} style={{ marginRight: '8px' }} />
            Save All Settings
          </button>
        </div>
      </div>
    </Layout>
  );
}
