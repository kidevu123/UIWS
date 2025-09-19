import { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";

interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  createdBy: 'user1' | 'user2';
  type: 'intimate' | 'date' | 'talk' | 'special';
  isPrivate?: boolean;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: Appointment[];
}

export default function AppointmentsPage(){
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'intimate' as const
  });

  // Sample data for demonstration
  useEffect(() => {
    const now = new Date();
    const sampleAppointments: Appointment[] = [
      {
        id: '1',
        title: 'Candlelit Dinner',
        description: 'Romantic evening at home with wine and our favorite music',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 19, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 22, 0),
        createdBy: 'user1',
        type: 'date'
      },
      {
        id: '2',
        title: 'Morning Connection',
        description: 'Slow, intimate morning together before the day begins',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 8, 30),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 0),
        createdBy: 'user2',
        type: 'intimate'
      },
      {
        id: '3',
        title: 'Deep Conversation',
        description: 'Share our thoughts and dreams over coffee',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 15, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 17, 0),
        createdBy: 'user1',
        type: 'talk'
      }
    ];
    setAppointments(sampleAppointments);
  }, []);

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayAppointments = appointments.filter(apt => 
        apt.startTime.toDateString() === current.toDateString()
      );
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        appointments: dayAppointments
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'intimate': return 'var(--rose)';
      case 'date': return 'var(--accent)';
      case 'talk': return 'var(--gold)';
      case 'special': return 'var(--neon)';
      default: return 'var(--ink-secondary)';
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'intimate': return 'heart';
      case 'date': return 'sparkles';
      case 'talk': return 'chat';
      case 'special': return 'star';
      default: return 'calendar';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCreateAppointment = async () => {
    if (!newAppointment.title || !newAppointment.date || !newAppointment.startTime) return;

    const startDateTime = new Date(`${newAppointment.date}T${newAppointment.startTime}`);
    const endDateTime = newAppointment.endTime 
      ? new Date(`${newAppointment.date}T${newAppointment.endTime}`)
      : new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default 1 hour

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: newAppointment.title,
      description: newAppointment.description,
      startTime: startDateTime,
      endTime: endDateTime,
      createdBy: 'user1', // In real app, get from auth
      type: newAppointment.type
    };

    setAppointments(prev => [...prev, appointment]);
    setShowCreateModal(false);
    setNewAppointment({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'intimate'
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Sacred Moments</h1>
        <p className="page-subtitle">Plan and cherish your intimate time together</p>
      </div>
      
      {/* Navigation Header */}
      <div className="appointments-header">
        <div className="appointments-nav">
          <button 
            className={`view-toggle ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            <Icon name="calendar" size={18} />
            Calendar View
          </button>
          <button 
            className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <Icon name="menu" size={18} />
            List View
          </button>
        </div>
        
        <button 
          className="btn"
          onClick={() => setShowCreateModal(true)}
        >
          <Icon name="plus" size={18} />
          Create Moment
        </button>
      </div>

      {viewMode === 'calendar' ? (
        <div className="calendar-container">
          {/* Calendar Header */}
          <div className="calendar-header">
            <button 
              className="calendar-nav-btn"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            >
              <Icon name="left" size={20} />
            </button>
            <h2 className="calendar-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button 
              className="calendar-nav-btn"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            >
              <Icon name="right" size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Day Headers */}
            {dayNames.map(day => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {getCalendarDays().map((day, index) => (
              <div 
                key={index} 
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${
                  day.date.toDateString() === new Date().toDateString() ? 'today' : ''
                }`}
                onClick={() => setSelectedDate(day.date)}
              >
                <span className="day-number">{day.date.getDate()}</span>
                {day.appointments.length > 0 && (
                  <div className="day-appointments">
                    {day.appointments.slice(0, 3).map((apt, i) => (
                      <div 
                        key={apt.id} 
                        className="day-appointment"
                        style={{ backgroundColor: getAppointmentTypeColor(apt.type) }}
                      >
                        <Icon name={getAppointmentTypeIcon(apt.type)} size={10} color="white" />
                      </div>
                    ))}
                    {day.appointments.length > 3 && (
                      <div className="day-appointment-more">+{day.appointments.length - 3}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.length === 0 ? (
            <div className="empty-state">
              <Icon name="calendar" size={64} color="var(--accent)" />
              <h3 className="h3">No moments planned yet</h3>
              <p className="sub">Create your first sacred moment together</p>
              <button className="btn" onClick={() => setShowCreateModal(true)}>
                <Icon name="plus" size={18} />
                Create Your First Moment
              </button>
            </div>
          ) : (
            <div className="appointments-grid">
              {appointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-type" style={{ color: getAppointmentTypeColor(appointment.type) }}>
                      <Icon name={getAppointmentTypeIcon(appointment.type)} size={20} />
                    </div>
                    <div className="appointment-meta">
                      <h3 className="appointment-title">{appointment.title}</h3>
                      <p className="appointment-time">
                        {appointment.startTime.toLocaleDateString()} • {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                      </p>
                    </div>
                  </div>
                  {appointment.description && (
                    <p className="appointment-description">{appointment.description}</p>
                  )}
                  <div className="appointment-footer">
                    <span className="appointment-creator">
                      Created by {appointment.createdBy === 'user1' ? 'You' : 'Your Partner'}
                    </span>
                    <div className="appointment-actions">
                      <button className="btn-secondary btn-small">
                        <Icon name="edit" size={16} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="appointment-modal" onClick={() => setShowCreateModal(false)}>
          <div className="appointment-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="appointment-modal-header">
              <h3>Create Sacred Moment</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <Icon name="close" size={20} />
              </button>
            </div>
            
            <div className="appointment-modal-body">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Name your beautiful moment..."
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  placeholder="Add any special details or notes..."
                  value={newAppointment.description}
                  onChange={(e) => setNewAppointment({...newAppointment, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={newAppointment.startTime}
                    onChange={(e) => setNewAppointment({...newAppointment, startTime: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={newAppointment.endTime}
                    onChange={(e) => setNewAppointment({...newAppointment, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Type of Moment</label>
                <div className="appointment-types">
                  {[
                    { value: 'intimate', label: 'Intimate Time', icon: 'heart' },
                    { value: 'date', label: 'Date Night', icon: 'sparkles' },
                    { value: 'talk', label: 'Deep Talk', icon: 'chat' },
                    { value: 'special', label: 'Special Event', icon: 'star' }
                  ].map(type => (
                    <button
                      key={type.value}
                      className={`appointment-type-btn ${newAppointment.type === type.value ? 'active' : ''}`}
                      onClick={() => setNewAppointment({...newAppointment, type: type.value as any})}
                    >
                      <Icon name={type.icon} size={16} />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="appointment-modal-footer">
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="btn" onClick={handleCreateAppointment}>
                <Icon name="heart" size={16} />
                Create Moment
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
