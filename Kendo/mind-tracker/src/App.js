import React, { useState, useEffect } from 'react';
import './App.css';
import '@progress/kendo-theme-default/dist/all.css';

// Import KendoReact components
import { Button } from '@progress/kendo-react-buttons';
import { Input, TextArea, Checkbox, RadioGroup, Radio, Switch } from '@progress/kendo-react-inputs';
import { DatePicker, TimePicker, DateTimePicker, Calendar } from '@progress/kendo-react-dateinputs';
import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { TabStrip, TabStripTab, Stepper, Step, Card, CardHeader, CardTitle, CardBody, CardActions, Drawer, DrawerContent } from '@progress/kendo-react-layout';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { Upload } from '@progress/kendo-react-upload';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartTitle, ChartLegend } from '@progress/kendo-react-charts';
import 'hammerjs';

// Quick Mood Tracker Component
const QuickMoodTracker = ({ onSave }) => {
  const [quickEntry, setQuickEntry] = useState({
    mood: 'Neutral',
    thoughts: '',
    date: new Date(),
  });
  
  const moodEmojis = {
    'Happy': '😊',
    'Excited': '😃',
    'Grateful': '🙏',
    'Relaxed': '😌',
    'Neutral': '😐',
    'Stressed': '😓',
    'Anxious': '😰',
    'Sad': '😢',
    'Angry': '😡',
    'Overwhelmed': '😫'
  };
  
  const moodOptions = Object.keys(moodEmojis);
  
  const saveQuickEntry = () => {
    if (!quickEntry.thoughts.trim()) {
      return;
    }
    onSave({
      ...quickEntry,
      time: new Date(),
      moodIntensity: 5,
      activity: 'Quick Entry',
      tags: [],
      media: [],
      isPrivate: false,
      location: '',
      weather: ''
    });
    
    // Reset form
    setQuickEntry({
      mood: 'Neutral',
      thoughts: '',
      date: new Date()
    });
  };
  
  return (
    <Card className="quick-mood-tracker">
      <CardHeader>
        <CardTitle>Quick Mood Check-in</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="quick-tracker-content">
          <div className="mood-emoji-container">
            {moodOptions.map(mood => (
              <div 
                key={mood}
                className={`mood-emoji ${quickEntry.mood === mood ? 'selected' : ''}`}
                onClick={() => setQuickEntry({...quickEntry, mood})}
                title={mood}
              >
                <span>{moodEmojis[mood]}</span>
                <span className="mood-label">{mood}</span>
              </div>
            ))}
          </div>
          <div className="quick-thought-input">
            <TextArea
              value={quickEntry.thoughts}
              onChange={(e) => setQuickEntry({...quickEntry, thoughts: e.value})}
              placeholder="What's on your mind right now? (Quick entry)"
              rows={2}
            />
          </div>
          <div className="quick-entry-actions">
            <DatePicker
              value={quickEntry.date}
              onChange={(e) => setQuickEntry({...quickEntry, date: e.value})}
              format="MMM d"
              width="120px"
            />
            <Button
              primary={true}
              disabled={!quickEntry.thoughts.trim()}
              onClick={saveQuickEntry}
            >
              Save Quick Entry
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

function App() {
  // State for entries, form input, selected tab, and UI controls
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    id: null,
    date: new Date(),
    time: new Date(),
    mood: 'Neutral',
    moodIntensity: 5,
    activity: '',
    thoughts: '',
    tags: [],
    media: [],
    isPrivate: false,
    location: '',
    weather: '',
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ visible: false, entryId: null });
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' });
  const [currentStep, setCurrentStep] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ mood: '', dateFrom: null, dateTo: null, searchText: '' });
  const [selectedEntryForView, setSelectedEntryForView] = useState(null);
  const [showEntryDetails, setShowEntryDetails] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [entryComplete, setEntryComplete] = useState(0);
  
  // Added state for new features
  const [showReminders, setShowReminders] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [moodTrends, setMoodTrends] = useState({ data: [] });
  const [showMoodTrends, setShowMoodTrends] = useState(false);
  
  // Load saved entries from localStorage when the app loads
  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('mindTrackerEntries');
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries).map(entry => ({
          ...entry,
          date: new Date(entry.date),
          time: new Date(entry.time || entry.date),
        }));
        setEntries(parsedEntries);
      }
      
      // Load reminders
      const storedReminders = localStorage.getItem('mindTrackerReminders');
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders).map(reminder => ({
          ...reminder,
          time: new Date(reminder.time)
        })));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);
  
  // Save entries to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('mindTrackerEntries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries to localStorage:', error);
    }
  }, [entries]);
  
  // Save reminders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mindTrackerReminders', JSON.stringify(reminders));
    } catch (error) {
      console.error('Error saving reminders to localStorage:', error);
    }
  }, [reminders]);

  // Calculate entry completion percentage
  useEffect(() => {
    let completionPercentage = 0;
    if (newEntry.date) completionPercentage += 15;
    if (newEntry.mood) completionPercentage += 15;
    if (newEntry.activity.trim()) completionPercentage += 20;
    if (newEntry.thoughts.trim()) completionPercentage += 30;
    if (newEntry.tags.length > 0) completionPercentage += 10;
    if (newEntry.media.length > 0) completionPercentage += 10;
    
    setEntryComplete(completionPercentage);
  }, [newEntry]);
  
  // Calculate mood trends
  useEffect(() => {
    if (entries.length > 0) {
      // Group entries by date and calculate average mood intensity
      const moodValues = {
        'Happy': 8, 'Excited': 9, 'Grateful': 7, 'Relaxed': 6, 
        'Neutral': 5, 'Stressed': 4, 'Anxious': 3, 'Sad': 2, 
        'Angry': 2, 'Overwhelmed': 1
      };
      
      // Create a map of dates to mood values
      const moodsByDate = {};
      
      entries.forEach(entry => {
        const dateStr = new Date(entry.date).toLocaleDateString();
        if (!moodsByDate[dateStr]) {
          moodsByDate[dateStr] = { sum: 0, count: 0 };
        }
        moodsByDate[dateStr].sum += moodValues[entry.mood] || 5;
        moodsByDate[dateStr].count += 1;
      });
      
      // Convert to array sorted by date
      const trendData = Object.keys(moodsByDate).map(date => ({
        date,
        value: moodsByDate[date].sum / moodsByDate[date].count
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setMoodTrends({ data: trendData });
    }
  }, [entries]);

  // Mood options for dropdown
  const moodOptions = ['Happy', 'Excited', 'Grateful', 'Relaxed', 'Neutral', 'Stressed', 'Anxious', 'Sad', 'Angry', 'Overwhelmed'];
  
  // Tag options for multiselect
  const tagOptions = ['Work', 'Family', 'Health', 'Fitness', 'Food', 'Sleep', 'Social', 'Hobby', 'Nature', 'Learning', 'Meditation', 'Travel'];
  
  // Weather options for dropdown
  const weatherOptions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Windy', 'Foggy', 'Hot', 'Cold'];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  // Handle date change
  const handleDateChange = (e) => {
    if (e && e.value) {
      setNewEntry({ ...newEntry, date: e.value });
    }
  };

  // Handle time change
  const handleTimeChange = (e) => {
    if (e && e.value) {
      setNewEntry({ ...newEntry, time: e.value });
    }
  };

  // Handle mood selection
  const handleMoodChange = (e) => {
    if (e && e.value) {
      setNewEntry({ ...newEntry, mood: e.value });
    }
  };

  // Handle mood intensity slider
  const handleMoodIntensity = (e) => {
    setNewEntry({ ...newEntry, moodIntensity: e.value });
  };

  // Handle tag selection
  const handleTagsChange = (e) => {
    setNewEntry({ ...newEntry, tags: e.value || [] });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    if (e.newState && e.newState.length > 0) {
      const fileInfos = e.newState.map(file => ({ name: file.name, size: file.size, uid: file.uid }));
      setNewEntry({ ...newEntry, media: fileInfos });
    }
  };

  // Handle privacy toggle
  const handlePrivacyChange = (e) => {
    setNewEntry({ ...newEntry, isPrivate: e.value });
  };

  // Handle tab selection
  const handleTabSelect = (e) => {
    if (e && typeof e.selected === 'number') {
      setSelectedTab(e.selected);
    }
  };

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setDrawerExpanded(!drawerExpanded);
  };

  // Handle step change
  const handleStepChange = (e) => {
    setCurrentStep(e.value);
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters to entries
  const filteredEntries = entries.filter(entry => {
    // Filter by mood
    if (filters.mood && entry.mood !== filters.mood) return false;
    
    // Filter by date range
    if (filters.dateFrom && new Date(entry.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(entry.date) > new Date(filters.dateTo)) return false;
    
    // Filter by search text in thoughts or activity
    if (
      filters.searchText && 
      !entry.thoughts.toLowerCase().includes(filters.searchText.toLowerCase()) && 
      !entry.activity.toLowerCase().includes(filters.searchText.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });

  // Add a new entry (can accept data from quick entry)
  const addEntry = (entryData = null) => {
    const entryToSave = entryData || newEntry;
    
    if (!entryToSave.thoughts.trim()) {
      setNotification({
        visible: true,
        message: 'Please add some thoughts before saving.',
        type: 'error'
      });
      setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
      return;
    }
    
    const entryWithId = {
      ...entryToSave,
      id: editMode && editId ? editId : Date.now(),
      timestamp: new Date()
    };
    
    if (editMode && editId) {
      setEntries(entries.map(entry => entry.id === editId ? entryWithId : entry));
      setEditMode(false);
      setEditId(null);
      setNotification({
        visible: true,
        message: 'Entry updated successfully!',
        type: 'success'
      });
    } else {
      setEntries([entryWithId, ...entries]);
      setNotification({
        visible: true,
        message: 'New entry added successfully!',
        type: 'success'
      });
    }
    
    if (!entryData) {
      // Only reset the main form if not from quick entry
      setNewEntry({
        id: null,
        date: new Date(),
        time: new Date(),
        mood: 'Neutral',
        moodIntensity: 5,
        activity: '',
        thoughts: '',
        tags: [],
        media: [],
        isPrivate: false,
        location: '',
        weather: ''
      });
      
      // Reset step
      setCurrentStep(0);
    }
    
    // Hide notification after 3 seconds
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
  };
  
  // Handle adding a reminder
  const addReminder = (text, time) => {
    const newReminder = {
      id: Date.now(),
      text,
      time,
      active: true
    };
    
    setReminders([...reminders, newReminder]);
    setNotification({
      visible: true,
      message: 'Reminder set successfully!',
      type: 'success'
    });
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
  };
  
  // Delete a reminder
  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  // Edit an entry
  const editEntry = (id) => {
    const entryToEdit = entries.find(entry => entry.id === id);
    if (entryToEdit) {
      setNewEntry({
        ...entryToEdit,
        date: new Date(entryToEdit.date),
        time: new Date(entryToEdit.time || entryToEdit.date)
      });
      setEditMode(true);
      setEditId(id);
      setSelectedTab(0);
    }
  };

  // Show delete confirmation dialog
  const showDeleteConfirmation = (id) => {
    setConfirmDialog({ visible: true, entryId: id });
  };

  // Delete an entry after confirmation
  const deleteEntry = () => {
    setEntries(entries.filter(entry => entry.id !== confirmDialog.entryId));
    setConfirmDialog({ visible: false, entryId: null });
    setNotification({
      visible: true,
      message: 'Entry deleted successfully!',
      type: 'success'
    });
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
  };

  // View entry details
  const viewEntryDetails = (entry) => {
    setSelectedEntryForView(entry);
    setShowEntryDetails(true);
  };

  // Format data for grid to avoid JSON circular reference
  const gridData = filteredEntries.map(entry => ({
    ...entry,
    date: entry.date.toLocaleDateString(),
    time: entry.time ? new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    tags: entry.tags ? entry.tags.join(', ') : '',
    id: entry.id.toString() // Ensure ID is string to avoid potential issues
  }));

  // Calculate statistics for mood chart
  const moodStats = moodOptions.map(mood => {
    return {
      mood,
      count: entries.filter(entry => entry.mood === mood).length
    };
  }).filter(stat => stat.count > 0);

  // Calculate daily entry counts for the past week
  const getDailyEntries = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dailyCounts = Array(7).fill(0);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate >= oneWeekAgo) {
        const dayIndex = entryDate.getDay();
        dailyCounts[dayIndex]++;
      }
    });
    
    return days.map((day, index) => ({ day, count: dailyCounts[index] }));
  };
  
  // Calculate most common mood safely
  const calculateMostCommonMood = () => {
    if (entries.length === 0) return 'N/A';
    
    const moodCounts = {};
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    let maxMood = null;
    let maxCount = 0;
    
    Object.keys(moodCounts).forEach(mood => {
      if (moodCounts[mood] > maxCount) {
        maxCount = moodCounts[mood];
        maxMood = mood;
      }
    });
    
    return maxMood || 'N/A';
  };

  return (
    <div className="app-container">
      <Button 
        className="menu-button" 
        icon="menu" 
        onClick={handleDrawerToggle}
        title="Menu"
      />
      
      <Drawer
        expanded={drawerExpanded}
        position="start"
        mode="overlay"
        onOverlayClick={handleDrawerToggle}
        style={{ width: 280 }}
      >
        <DrawerContent>
          <div className="drawer-content">
            <h2>Mind Tracker</h2>
            <ul className="drawer-menu">
              <li onClick={() => { setSelectedTab(0); setDrawerExpanded(false); }}>New Entry</li>
              <li onClick={() => { setSelectedTab(1); setDrawerExpanded(false); }}>Journal Entries</li>
              <li onClick={() => { setSelectedTab(2); setDrawerExpanded(false); }}>Statistics</li>
              <li onClick={() => { setShowStatistics(true); setDrawerExpanded(false); }}>Mood Chart</li>
              <li onClick={() => { setShowReminders(true); setDrawerExpanded(false); }}>Reminders</li>
              <li onClick={() => { setShowMoodTrends(true); setDrawerExpanded(false); }}>Mood Trends</li>
            </ul>
            <div className="drawer-stats">
              <p>Total Entries: {entries.length}</p>
              <p>Most Common Mood: {calculateMostCommonMood()}</p>
              <p>Entries This Week: {
                entries.filter(entry => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(entry.date) >= oneWeekAgo;
                }).length
              }</p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <header className="app-header">
        <h1>Mind Tracker</h1>
        <p>Track your thoughts, moods, and daily activities</p>
      </header>

      {/* New QuickMoodTracker component just below the header */}
      <div className="quick-tracker-container">
        <QuickMoodTracker onSave={addEntry} />
      </div>

      <main className="app-main">
        <TabStrip selected={selectedTab} onSelect={handleTabSelect}>
          <TabStripTab title="New Entry">
            <div className="entry-form">
              <h2>{editMode ? "Edit Entry" : "How are you feeling today?"}</h2>
              
              <div className="custom-stepper">
                <div 
                  className={`step ${currentStep === 0 ? 'active' : ''}`} 
                  onClick={() => setCurrentStep(0)}
                >
                  <span className="step-number">1</span>
                  <span className="step-label">Date & Mood</span>
                </div>
                <div 
                  className={`step ${currentStep === 1 ? 'active' : ''}`} 
                  onClick={() => setCurrentStep(1)}
                >
                  <span className="step-number">2</span>
                  <span className="step-label">Activities</span>
                </div>
                <div 
                  className={`step ${currentStep === 2 ? 'active' : ''}`} 
                  onClick={() => setCurrentStep(2)}
                >
                  <span className="step-number">3</span>
                  <span className="step-label">Thoughts</span>
                </div>
                <div 
                  className={`step ${currentStep === 3 ? 'active' : ''}`} 
                  onClick={() => setCurrentStep(3)}
                >
                  <span className="step-number">4</span>
                  <span className="step-label">Details</span>
                </div>
              </div>

              <div className="stepper-content">
                {currentStep === 0 && (
                  <div className="step-container">
                    <div className="form-group">
                      <label>Date:</label>
                      <DatePicker
                        value={newEntry.date}
                        onChange={handleDateChange}
                        format="MMMM d, yyyy"
                      />
                    </div>

                    <div className="form-group">
                      <label>Time:</label>
                      <TimePicker
                        value={newEntry.time}
                        onChange={handleTimeChange}
                        format="h:mm tt"
                      />
                    </div>

                    <div className="form-group">
                      <label>Mood:</label>
                      <DropDownList
                        data={moodOptions}
                        value={newEntry.mood}
                        onChange={handleMoodChange}
                        name="mood"
                      />
                    </div>

                    <div className="form-group">
                      <label>Mood Intensity (1-10): {newEntry.moodIntensity}</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={newEntry.moodIntensity}
                        onChange={(e) => setNewEntry({...newEntry, moodIntensity: Number(e.target.value)})}
                        className="intensity-slider" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Weather:</label>
                      <DropDownList
                        data={weatherOptions}
                        value={newEntry.weather}
                        onChange={(e) => setNewEntry({...newEntry, weather: e.value})}
                        name="weather"
                        placeholder="Select weather..."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="step-container">
                    <div className="form-group">
                      <label>Activity:</label>
                      <Input
                        name="activity"
                        value={newEntry.activity}
                        onChange={handleInputChange}
                        placeholder="What have you been doing?"
                      />
                    </div>

                    <div className="form-group">
                      <label>Location:</label>
                      <Input
                        name="location"
                        value={newEntry.location}
                        onChange={handleInputChange}
                        placeholder="Where are you?"
                      />
                    </div>

                    <div className="form-group">
                      <label>Tags:</label>
                      <MultiSelect
                        data={tagOptions}
                        value={newEntry.tags}
                        onChange={handleTagsChange}
                        placeholder="Select tags..."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="step-container">
                    <div className="form-group">
                      <label>Thoughts:</label>
                      <TextArea
                        name="thoughts"
                        value={newEntry.thoughts}
                        onChange={handleInputChange}
                        placeholder="Write your thoughts here..."
                        rows={8}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="step-container">
                    <div className="form-group">
                      <label>Add Media:</label>
                      <Upload
                        batch={false}
                        multiple={true}
                        files={newEntry.media}
                        onAdd={handleFileUpload}
                        onRemove={(e) => setNewEntry({...newEntry, media: e.newState})}
                        withCredentials={false}
                        saveUrl="https://demos.telerik.com/kendo-ui/service-v4/upload/save"
                        removeUrl="https://demos.telerik.com/kendo-ui/service-v4/upload/remove"
                      />
                    </div>

                    <div className="form-group privacy-switch">
                      <Switch
                        checked={newEntry.isPrivate}
                        onChange={(e) => setNewEntry({...newEntry, isPrivate: e.value})}
                      />
                      <label>Private Entry</label>
                    </div>

                    <div className="form-completion">
                      <label>Entry Completion:</label>
                      <ProgressBar value={entryComplete} labelVisible={true} />
                    </div>
                  </div>
                )}

                <div className="step-buttons">
                  {currentStep > 0 && (
                    <Button
                      onClick={prevStep}
                      icon="arrow-left"
                    >
                      Back
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button
                      primary={true}
                      onClick={nextStep}
                      icon="arrow-right"
                      iconPosition="after"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      primary={true}
                      onClick={() => addEntry()}
                      disabled={!newEntry.thoughts.trim()}
                    >
                      {editMode ? "Update Entry" : "Save Entry"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabStripTab>

          <TabStripTab title="Journal Entries">
            <div className="filters-section">
              <h3>Filter Entries</h3>
              <div className="filters-container">
                <div className="filter-item">
                  <label>Mood:</label>
                  <DropDownList
                    data={['', ...moodOptions]}
                    value={filters.mood}
                    onChange={(e) => setFilters({...filters, mood: e.value})}
                    placeholder="All moods"
                  />
                </div>
                <div className="filter-item">
                  <label>From:</label>
                  <DatePicker
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.value})}
                    format="MM/dd/yyyy"
                  />
                </div>
                <div className="filter-item">
                  <label>To:</label>
                  <DatePicker
                    value={filters.dateTo}
                    onChange={(e) => setFilters({...filters, dateTo: e.value})}
                    format="MM/dd/yyyy"
                  />
                </div>
                <div className="filter-item">
                  <label>Search:</label>
                  <Input
                    value={filters.searchText}
                    onChange={(e) => setFilters({...filters, searchText: e.value})}
                    placeholder="Search in thoughts or activities"
                  />
                </div>
                <Button
                  onClick={() => setFilters({ mood: '', dateFrom: null, dateTo: null, searchText: '' })}
                  icon="reset"
                >
                  Reset
                </Button>
              </div>
            </div>

            {filteredEntries.length > 0 ? (
              <Grid
                data={gridData}
                style={{ height: '400px' }}
              >
                <GridColumn field="date" title="Date" width="100px" />
                <GridColumn field="time" title="Time" width="90px" />
                <GridColumn field="mood" title="Mood" width="100px" />
                <GridColumn field="activity" title="Activity" width="150px" />
                <GridColumn field="thoughts" title="Thoughts" />
                <GridColumn field="tags" title="Tags" width="150px" />
                <GridColumn
                  title="Actions"
                  width="180px"
                  cell={(props) => (
                    <td>
                      <Button
                        onClick={() => viewEntryDetails(props.dataItem)}
                        title="View"
                        className="grid-button"
                        icon="eye"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => editEntry(parseInt(props.dataItem.id))}
                        title="Edit"
                        className="grid-button"
                        icon="edit"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => showDeleteConfirmation(parseInt(props.dataItem.id))}
                        title="Delete"
                        className="grid-button"
                        icon="trash"
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                />
              </Grid>
            ) : (
              <div className="no-entries">
                <p>No journal entries found with the current filters. Try adjusting your filters or add a new entry!</p>
              </div>
            )}
          </TabStripTab>

          <TabStripTab title="Statistics">
            <div className="statistics">
              <h2>Mind Tracker Statistics</h2>
              
              <div className="stat-cards">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Entries</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p className="stat-value">{entries.length}</p>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Most Common Mood</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p className="stat-value">{calculateMostCommonMood()}</p>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Entries This Week</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p className="stat-value">
                      {entries.filter(entry => {
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        return new Date(entry.date) >= oneWeekAgo;
                      }).length}
                    </p>
                  </CardBody>
                </Card>
              </div>
              
              <div className="chart-container">
                <h3>Mood Distribution</h3>
                <Chart>
                  <ChartTitle text="Your Moods" />
                  <ChartLegend position="bottom" />
                  <ChartSeries>
                    <ChartSeriesItem
                      type="pie"
                      data={moodStats}
                      field="count"
                      categoryField="mood"
                      labels={{
                        visible: true,
                        content: (e) => `${e.category}: ${e.value}`
                      }}
                    />
                  </ChartSeries>
                </Chart>
              </div>
              
              <div className="chart-container">
                <h3>Daily Entries (Last Week)</h3>
                <Chart>
                  <ChartTitle text="Entries by Day" />
                  <ChartLegend position="bottom" />
                  <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={getDailyEntries().map(item => item.day)} />
                  </ChartCategoryAxis>
                  <ChartValueAxis>
                    <ChartValueAxisItem title={{ text: 'Number of Entries' }} min={0} />
                  </ChartValueAxis>
                  <ChartSeries>
                    <ChartSeriesItem
                      type="column"
                      data={getDailyEntries().map(item => item.count)}
                      color="#3e4eb8"
                    />
                  </ChartSeries>
                </Chart>
              </div>
            </div>
          </TabStripTab>
        </TabStrip>
      </main>

      <footer className="app-footer">
        <p>Mind Tracker © {new Date().getFullYear()} - Your Personal Journal</p>
      </footer>

      {/* Notifications */}
      {notification.visible && (
        <Notification
          type={{ style: notification.type, icon: true }}
          closable={true}
          onClose={() => setNotification({ ...notification, visible: false })}
        >
          <span>{notification.message}</span>
        </Notification>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.visible && (
        <Dialog title="Confirm Deletion" onClose={() => setConfirmDialog({ visible: false, entryId: null })}>
          <p>Are you sure you want to delete this entry? This action cannot be undone.</p>
          <DialogActionsBar>
            <Button onClick={() => setConfirmDialog({ visible: false, entryId: null })}>Cancel</Button>
            <Button themeColor="primary" onClick={deleteEntry}>Delete</Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Entry Details Dialog */}
      {showEntryDetails && selectedEntryForView && (
        <Dialog title="Entry Details" onClose={() => setShowEntryDetails(false)} width={700}>
          <div className="entry-details">
            <div className="entry-detail-item">
              <strong>Date:</strong> {new Date(selectedEntryForView.date).toLocaleDateString()}
            </div>
            <div className="entry-detail-item">
              <strong>Time:</strong> {selectedEntryForView.time}
            </div>
            <div className="entry-detail-item">
              <strong>Mood:</strong> {selectedEntryForView.mood} 
              {selectedEntryForView.moodIntensity && <span> (Intensity: {selectedEntryForView.moodIntensity}/10)</span>}
            </div>
            <div className="entry-detail-item">
              <strong>Activity:</strong> {selectedEntryForView.activity}
            </div>
            <div className="entry-detail-item">
              <strong>Location:</strong> {selectedEntryForView.location || 'Not specified'}
            </div>
            <div className="entry-detail-item">
              <strong>Weather:</strong> {selectedEntryForView.weather || 'Not specified'}
            </div>
            <div className="entry-detail-item">
              <strong>Tags:</strong> {selectedEntryForView.tags && selectedEntryForView.tags.length > 0 ? selectedEntryForView.tags : 'None'}
            </div>
            <div className="entry-detail-item thoughts-section">
              <strong>Thoughts:</strong> {selectedEntryForView.thoughts}
            </div>
            <div className="entry-detail-item">
              <strong>Media:</strong> {selectedEntryForView.media && selectedEntryForView.media.length > 0 ? (
                <ul>
                  {selectedEntryForView.media.map((file, index) => (
                    <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                  ))}
                </ul>
              ) : 'None'}
            </div>
            <div className="entry-detail-item">
              <strong>Private:</strong> {selectedEntryForView.isPrivate ? 'Yes' : 'No'}
            </div>
          </div>
          <DialogActionsBar>
            <Button onClick={() => setShowEntryDetails(false)}>Close</Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Reminders Dialog */}
      {showReminders && (
        <Dialog title="Mood & Mindfulness Reminders" onClose={() => setShowReminders(false)} width={700}>
          <div className="reminders-dialog">
            <div className="add-reminder-form">
              <h3>Set a New Reminder</h3>
              <div className="reminder-form-row">
                <div className="form-group">
                  <label>Reminder Description:</label>
                  <Input
                    id="reminderText"
                    placeholder="e.g., Take a mindfulness break"
                  />
                </div>
                <div className="form-group">
                  <label>Time:</label>
                  <TimePicker
                    id="reminderTime"
                    defaultValue={new Date()}
                    format="h:mm tt"
                  />
                </div>
                <Button
                  primary={true}
                  onClick={() => {
                    const textElement = document.getElementById('reminderText');
                    const timeElement = document.getElementById('reminderTime');
                    
                    if (textElement && textElement.value && timeElement) {
                      const text = textElement.value;
                      // Handle time safely by using the actual widget API if available
                      // or falling back to the current time
                      let time;
                      try {
                        // Try Kendo's API first
                        if (timeElement.kendoWidget) {
                          time = timeElement.kendoWidget.value();
                        } else if (timeElement.value) {
                          time = new Date(timeElement.value);
                        } else {
                          time = new Date();
                        }
                      } catch (e) {
                        time = new Date();
                      }
                      
                      addReminder(text, time);
                      textElement.value = '';
                    }
                  }}
                >
                  Add Reminder
                </Button>
              </div>
            </div>
            
            <div className="reminders-list">
              <h3>Your Reminders</h3>
              {reminders.length > 0 ? (
                <div className="reminders-grid">
                  {reminders.map(reminder => (
                    <Card key={reminder.id} className="reminder-card">
                      <CardBody>
                        <div className="reminder-content">
                          <div className="reminder-text">{reminder.text}</div>
                          <div className="reminder-time">
                            {new Date(reminder.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="reminder-actions">
                            <Switch
                              checked={reminder.active}
                              onChange={() => {
                                setReminders(reminders.map(r => 
                                  r.id === reminder.id ? {...r, active: !r.active} : r
                                ));
                              }}
                            />
                            <Button
                              icon="trash"
                              onClick={() => deleteReminder(reminder.id)}
                              title="Delete reminder"
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No reminders set yet. Add one above to get started!</p>
              )}
            </div>
          </div>
          <DialogActionsBar>
            <Button onClick={() => setShowReminders(false)}>Close</Button>
          </DialogActionsBar>
        </Dialog>
      )}
      
      {/* Mood Trends Dialog */}
      {showMoodTrends && (
        <Dialog title="Your Mood Trends Over Time" onClose={() => setShowMoodTrends(false)} width={800}>
          <div className="mood-trends-dialog">
            <h3>Mood Pattern Analysis</h3>
            
            {moodTrends.data.length > 1 ? (
              <div className="chart-container">
                <Chart>
                  <ChartTitle text="Mood Changes Over Time" />
                  <ChartLegend position="bottom" />
                  <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={moodTrends.data.map(item => item.date)} />
                  </ChartCategoryAxis>
                  <ChartValueAxis>
                    <ChartValueAxisItem 
                      title={{ text: 'Mood Score (Higher is Better)' }} 
                      min={0} 
                      max={10}
                    />
                  </ChartValueAxis>
                  <ChartSeries>
                    <ChartSeriesItem
                      type="line"
                      data={moodTrends.data.map(item => item.value)}
                      style="smooth"
                      markers={{ visible: true }}
                      color="#51a0fa"
                    />
                  </ChartSeries>
                </Chart>
                
                <div className="mood-trends-insights">
                  <h4>Insights:</h4>
                  <ul>
                    <li>Your average mood is <strong>{(moodTrends.data.reduce((sum, item) => sum + item.value, 0) / moodTrends.data.length).toFixed(1)} out of 10</strong></li>
                    <li>
                      {moodTrends.data.length > 1 && moodTrends.data[moodTrends.data.length - 1].value > moodTrends.data[0].value 
                        ? "Your mood has improved overall since you started tracking" 
                        : "Your mood has changed since you started tracking"}
                    </li>
                    <li>Best day: <strong>{moodTrends.data.length > 0 ? 
                        [...moodTrends.data].sort((a, b) => b.value - a.value)[0].date : 'No data'}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <p>Not enough data to show mood trends yet. Keep adding entries to see your patterns over time.</p>
            )}
          </div>
          <DialogActionsBar>
            <Button onClick={() => setShowMoodTrends(false)}>Close</Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
}

export default App;