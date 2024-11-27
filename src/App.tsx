import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/Dashboard';
import Studio from './pages/Studio';
import MusicLibrary from './pages/MusicLibrary';
import Schedule from './pages/Schedule';
import Sidebar from './components/Sidebar';
import RadioPlayer from './components/RadioPlayer';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-radio-dark">
        <Sidebar />
        <div className="flex-1 overflow-auto pb-24">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/library" element={<MusicLibrary />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </div>
        <RadioPlayer />
        <ToastContainer 
          position="top-right"
          theme="dark"
          autoClose={3000}
        />
      </div>
    </Router>
  );
}

export default App;