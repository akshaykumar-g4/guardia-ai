
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, IncidentReport, UserRole, IncidentStatus, IncidentType, Severity, IncidentLocation } from './types';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

const MOCK_INCIDENTS: IncidentReport[] = [
  {
    id: '1',
    title: 'Student Conflict',
    description: 'Minor physical altercation reported between students near Academic Block A.',
    type: IncidentType.CRIME,
    severity: Severity.MEDIUM,
    status: IncidentStatus.PENDING,
    scope: 'CAMPUS',
    timestamp: new Date().toISOString(),
    location: { lat: 17.0855, lng: 82.0595, address: 'Academic Block A, Pragati Engineering College' },
    reporterId: 'user2',
    aiAnalysis: 'Immediate intervention required to stop the ongoing student conflict and ensure safety.',
    recommendedAsset: 'Security Guards'
  },
  {
    id: '3',
    title: 'boys are fighting',
    description: 'Ongoing physical fight between two groups of students near the canteen.',
    type: IncidentType.CRIME,
    severity: Severity.HIGH,
    status: IncidentStatus.PENDING,
    scope: 'CAMPUS',
    timestamp: new Date().toISOString(),
    location: { lat: 17.0880, lng: 82.0620, address: 'Canteen Area, Pragati Campus' },
    reporterId: 'user3',
    aiAnalysis: 'Deploy security personnel immediately to de-escalate the fighting and restore campus order.',
    recommendedAsset: 'Security Guards'
  },
  {
    id: '4',
    title: 'Medical Emergency',
    description: 'A student has fainted in the library and appears to have low blood pressure.',
    type: IncidentType.MEDICAL,
    severity: Severity.HIGH,
    status: IncidentStatus.PENDING,
    scope: 'CAMPUS',
    timestamp: new Date().toISOString(),
    location: { lat: 17.0890, lng: 82.0630, address: 'Library, Pragati Campus' },
    reporterId: 'user4',
    aiAnalysis: 'Requesting immediate medical assistance from the Campus Dispensary for the student.',
    recommendedAsset: 'Dispensary'
  },
  {
    id: '5',
    title: 'Laboratory Hazard',
    description: 'Chemical spill in the Chemistry lab. Critical safety risk detected.',
    type: IncidentType.OTHER,
    severity: Severity.CRITICAL,
    status: IncidentStatus.PENDING,
    scope: 'CAMPUS',
    timestamp: new Date().toISOString(),
    location: { lat: 17.0870, lng: 82.0610, address: 'Science Block, Ground Floor' },
    reporterId: 'user5',
    aiAnalysis: 'Critical hazard detected. Immediate notification sent to the Principal for high-level emergency protocol.',
    recommendedAsset: 'Principal'
  },
  {
    id: '2',
    title: 'Traffic Obstruction',
    description: 'Heavy vehicle breakdown on Surampalem main road blocking campus entry.',
    type: IncidentType.INFRASTRUCTURE,
    severity: Severity.LOW,
    status: IncidentStatus.PENDING,
    scope: 'CITY',
    timestamp: new Date().toISOString(),
    location: { lat: 17.0844, lng: 82.0572, address: 'Surampalem Main Road' },
    reporterId: 'user1',
    aiAnalysis: 'Local police alert recommended for traffic management outside campus bounds.',
    recommendedAsset: 'Local Police'
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('incidents');
    return saved ? JSON.parse(saved) : MOCK_INCIDENTS;
  });

  useEffect(() => {
    localStorage.setItem('incidents', JSON.stringify(incidents));
  }, [incidents]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const addIncident = (incident: IncidentReport) => {
    setIncidents(prev => [incident, ...prev]);
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => (inc.id === id ? { ...inc, status } : inc)));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {currentUser && <Navbar user={currentUser} onLogout={handleLogout} />}
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/admin-login" element={!currentUser ? <Login onLogin={handleLogin} isAdmin /> : <Navigate to="/" />} />
            <Route path="/" element={
              currentUser ? (
                currentUser.role === 'ADMIN' ? (
                  <AdminDashboard incidents={incidents} onUpdateStatus={updateIncidentStatus} />
                ) : (
                  <UserDashboard user={currentUser} incidents={incidents.filter(i => i.reporterId === currentUser.id)} onAddIncident={addIncident} />
                )
              ) : <Navigate to="/login" />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-white border-t py-4 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
          &copy; 2026 Guardia-AI. Smart Surampalem Campus and city Safety.
        </footer>
      </div>
    </Router>
  );
};

export default App;
