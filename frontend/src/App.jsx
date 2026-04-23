import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InterviewRoom from './pages/InterviewRoom';
import Results from './pages/Results';
import Profile from './pages/Profile';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import AiQuestions from './pages/AiQuestions';
import MockTest from './pages/MockTest';
import FeedbackPage from './pages/FeedbackPage';
import ProgressTracking from './pages/ProgressTracking';

// Services
import { authService } from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-bg">
        <motion.div
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar user={user} logout={logout} />
        
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route 
            path="/login" 
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/signup" 
            element={!user ? <Signup setUser={setUser} /> : <Navigate to="/dashboard" />} 
          />
          
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/interview/:id" 
            element={user ? <InterviewRoom user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/results/:id" 
            element={user ? <Results user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route
            path="/ai-questions"
            element={user ? <AiQuestions /> : <Navigate to="/login" />}
          />
          <Route
            path="/mock-test"
            element={user ? <MockTest /> : <Navigate to="/login" />}
          />
          <Route
            path="/feedback"
            element={user ? <FeedbackPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/progress"
            element={user ? <ProgressTracking /> : <Navigate to="/login" />}
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
