import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Header from './components/Header';
import HoursPopup from './components/HoursPopup';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import { LanguageProvider } from './components/LanguageContext';
import Home from './components/Home';
import TrackCalories from './components/TrackCalories';
import MealPlanner from './components/MealPlanner';
import ProgressHub from './components/ProgressHub';
import Settings from './components/Settings';
import Resources from './components/Resources';
import FindSupport from './components/FindSupport';
import KeyFeatures from './components/KeyFeatures';
import AdvancedFeatures from './components/AdvancedFeatures';
import VisualShowcase from './components/VisualShowcase';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Profile from './components/Profile'; // Capital P, agar file naam sahi hai

// Protected Layout (tera pehla wala)
const ProtectedLayout = ({ children, isScrolled, showNavOrderOptions, setShowNavOrderOptions, isMenuOpen, setIsMenuOpen, showHeroOrderOptions, setShowHeroOrderOptions, showHoursPopup, setShowHoursPopup }) => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Header
          isScrolled={isScrolled}
          showNavOrderOptions={showNavOrderOptions}
          setShowNavOrderOptions={setShowNavOrderOptions}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        <main className="pt-16">{children}</main>
        <HoursPopup
          showHoursPopup={showHoursPopup}
          setShowHoursPopup={setShowHoursPopup}
        />
        <Footer />
        <ChatWidget />
      </div>
    </LanguageProvider>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavOrderOptions, setShowNavOrderOptions] = useState(false);
  const [showHeroOrderOptions, setShowHeroOrderOptions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHoursPopup, setShowHoursPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center z-50 animate-pulse-slower">
        <div className="flex flex-col items-center justify-center">
          <img
            src="/logo.png"
            alt="NutriTrack Logo"
            className="w-40 h-40 object-contain mb-4 animate-bounce-subtle"
            onError={(e) => {
              e.target.src = 'https://placehold.co/128x128?text=Logo+Not+Available';
            }}
          />
          <div className="animate-spin-slow w-16 h-16 border-4 border-white border-t-transparent rounded-full mb-4"></div>
          <p className="text-white text-lg font-semibold animate-fadeInUp">
            Loading your health journey...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/home"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <Home // Yeh pehle jaise Home dikhega, but agar profile integrate karna hai to yahan Profile call kar sakta hai
                showHeroOrderOptions={showHeroOrderOptions}
                setShowHeroOrderOptions={setShowHeroOrderOptions}
              />
            </ProtectedLayout>
          }
        />
        <Route
          path="/track-calories"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <TrackCalories />
            </ProtectedLayout>
          }
        />
        <Route
          path="/meal-planner"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <MealPlanner />
            </ProtectedLayout>
          }
        />
        <Route
          path="/progress-hub"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <ProgressHub />
            </ProtectedLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <Settings />
            </ProtectedLayout>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <Resources />
            </ProtectedLayout>
          }
        />
        <Route
          path="/find-support"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <FindSupport />
            </ProtectedLayout>
          }
        />
        <Route
          path="/start-for-free"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <Home
                showHeroOrderOptions={showHeroOrderOptions}
                setShowHeroOrderOptions={setShowHeroOrderOptions}
              />
            </ProtectedLayout>
          }
        />
        <Route
          path="/features"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <KeyFeatures />
            </ProtectedLayout>
          }
        />
        <Route
          path="/advanced-features"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <AdvancedFeatures />
            </ProtectedLayout>
          }
        />
        <Route
          path="/visual-showcase"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <VisualShowcase />
            </ProtectedLayout>
          }
        />
        <Route
          path="/testimonials"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <Testimonials />
            </ProtectedLayout>
          }
        />
        <Route
          path="/cta"
          element={
            <ProtectedLayout
              isScrolled={isScrolled}
              showNavOrderOptions={showNavOrderOptions}
              setShowNavOrderOptions={setShowNavOrderOptions}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showHeroOrderOptions={showHeroOrderOptions}
              setShowHeroOrderOptions={setShowHeroOrderOptions}
              showHoursPopup={showHoursPopup}
              setShowHoursPopup={setShowHoursPopup}
            >
              <CTA />
            </ProtectedLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;