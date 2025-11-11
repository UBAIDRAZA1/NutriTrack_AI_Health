import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import axios from 'axios';

// Header component with language selection, user profile, and stylish design
const Header = React.memo(({ isScrolled, showNavOrderOptions, setShowNavOrderOptions, isMenuOpen, setIsMenuOpen }) => {
  const [showImages, setShowImages] = useState(true);
  const [user, setUser] = useState(null); // User data state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // Dropdown toggle
  const { language, setLanguage, translations } = useLanguage();
  const navigate = useNavigate();

  const orbitingImages = [
    {
      src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=150&auto=format&fit=crop',
      alt: 'Healthy Smoothie',
    },
    {
      src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=150&auto=format&fit=crop',
      alt: 'Fresh Salad',
    },
    {
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=150&auto=format&fit=crop',
      alt: 'Balanced Meal',
    },
  ];

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5001/api/auth/profile', {
            headers: { 'x-auth-token': token }
          });
          setUser(response.data);
        }
      } catch (err) {
        console.error('Fetch user error:', err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleNavOrderClick = useCallback((e) => {
    e.stopPropagation();
    setShowNavOrderOptions(!showNavOrderOptions);
    setIsMenuOpen(false);
    setShowProfileDropdown(false); // Close profile dropdown if open
  }, [showNavOrderOptions, setIsMenuOpen]);

  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
  }, [setLanguage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setShowProfileDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowImages(window.scrollY < 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowNavOrderOptions(false);
      setShowProfileDropdown(false);
    }
  }, [setShowNavOrderOptions]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const languages = ['English'];

  const menuItems = [
    { name: translations[language].home || 'Home', href: '/home' },
    { name: translations[language].planMeals || 'Meal Planner', href: '/meal-planner' },
    { name: translations[language].trackCalories || 'Track Calories', href: '/track-calories' },
    { name: translations[language].progressHub || 'Progress Hub', href: '/progress-hub' },
    { name: translations[language].resources || 'Resources', href: '/resources' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-br from-gray-900/80 via-black/50 to-gray-800/80'} ${showImages ? 'h-48 md:h-20' : 'h-16'}`}
      aria-label="Main Navigation"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-16 h-16 object-contain animate-slideInLeft"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="w-16 h-16 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse-glow"
              style={{ display: 'none' }}
            >
              <span className="text-white font-bold text-lg uppercase">F</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`font-semibold transition-colors animate-slideInUp ${isScrolled ? 'text-gray-700 hover:text-emerald-500' : 'text-white hover:text-orange-300'}`}
                aria-label={`Navigate to ${item.name}`}
              >
                {item.name}
              </button>
            ))}
            <div className="relative">
              <button
                onClick={handleNavOrderClick}
                className="bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-emerald-500/50"
                aria-haspopup="true"
                aria-expanded={showNavOrderOptions}
              >
                {translations[language].getStarted || 'Get Started'}
              </button>
              {showNavOrderOptions && (
                <div className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg shadow-xl z-[100] overflow-hidden animate-fadeInUp">
                  <div className="flex justify-between items-center px-4 py-2 bg-orange-500/50">
                    <h3 className="text-white font-semibold">{translations[language].exploreOptions || 'Explore Options'}</h3>
                    <button
                      onClick={() => setShowNavOrderOptions(false)}
                      className="text-white hover:text-gray-200"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/start-for-free');
                      setShowNavOrderOptions(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-white font-semibold hover:bg-orange-500 transition-colors"
                  >
                    {translations[language].startForFree || 'Start for Free'}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/track-calories');
                      setShowNavOrderOptions(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-white font-semibold hover:bg-orange-500 transition-colors"
                  >
                    {translations[language].trackCalories || 'Track Calories'}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/meal-planner');
                      setShowNavOrderOptions(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-white font-semibold hover:bg-emerald-600 transition-colors"
                    >
                    {translations[language].planMeals || 'Plan Meals'}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/find-support');
                      setShowNavOrderOptions(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-white font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    {translations[language].findSupport || 'Find Support'}
                  </button>
                </div>
              )}
            </div>
            <div className="relative group">
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-emerald-500 text-white px-5 py-2 rounded-full hover:from-orange-500 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                aria-haspopup="true"
                aria-expanded={false}
              >
                <Globe className="w-5 h-5" />
                {language}
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg shadow-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className="block w-full text-left px-4 py-2 text-white font-semibold hover:bg-orange-500 transition-colors"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-emerald-500 text-white px-5 py-2 rounded-full font-semibold hover:from-orange-500 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                  aria-haspopup="true"
                  aria-expanded={showProfileDropdown}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline">{user.name || 'User'}</span>
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-lg shadow-xl z-[100] overflow-hidden animate-fadeInDown overflow-y-auto max-h-[50vh]">
                    <div className="px-4 py-2 bg-gradient-to-r from-orange-400 to-emerald-500 text-white">
                      <h3 className="text-base font-semibold">Profile</h3>
                    </div>
                    <div className="px-4 py-3 space-y-2 text-gray-800">
                      <p className="text-sm"><strong>Full Name:</strong> {user.name || 'N/A'}</p>
                      <p className="text-sm"><strong>Email:</strong> {user.email || 'N/A'}</p>
                      <p className="text-sm"><strong>Phone Number:</strong> {user.phone || 'N/A'}</p>
                      <p className="text-sm"><strong>Age:</strong> {user.profile?.age || 'N/A'}</p>
                      <p className="text-sm"><strong>Weight:</strong> {user.profile?.weight || 'N/A'} kg</p>
                      <p className="text-sm"><strong>Height:</strong> {user.profile?.height || 'N/A'} cm</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-white font-semibold bg-gradient-to-r from-orange-400 to-emerald-500 hover:from-orange-500 hover:to-emerald-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 md:hidden">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-emerald-500 text-white px-3 py-1 rounded-full font-semibold hover:from-orange-500 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                  aria-haspopup="true"
                  aria-expanded={showProfileDropdown}
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-lg shadow-xl z-[100] overflow-hidden animate-fadeInDown overflow-y-auto max-h-[50vh]">
                    <div className="px-4 py-2 bg-gradient-to-r from-orange-400 to-emerald-500 text-white">
                      <h3 className="text-base font-semibold">Profile</h3>
                    </div>
                    <div className="px-4 py-3 space-y-2 text-gray-800">
                      <p className="text-sm"><strong>Full Name:</strong> {user.name || 'N/A'}</p>
                      <p className="text-sm"><strong>Email:</strong> {user.email || 'N/A'}</p>
                      <p className="text-sm"><strong>Phone Number:</strong> {user.phone || 'N/A'}</p>
                      <p className="text-sm"><strong>Age:</strong> {user.profile?.age || 'N/A'}</p>
                      <p className="text-sm"><strong>Weight:</strong> {user.profile?.weight || 'N/A'} kg</p>
                      <p className="text-sm"><strong>Height:</strong> {user.profile?.height || 'N/A'} cm</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-white font-semibold bg-gradient-to-r from-orange-400 to-emerald-500 hover:from-orange-500 hover:to-emerald-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              className={`${isScrolled ? 'text-gray-800' : 'text-white'} p-2 rounded-full hover:bg-gray-200/50 transition-all duration-300`}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setShowNavOrderOptions(false);
                setShowProfileDropdown(false);
              }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {showImages && (
          <div className="relative h-28 flex items-center justify-center mt-2 transition-opacity duration-500 animate-fadeInUp md:hidden">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-orange-400/20 to-emerald-500/20 shadow-2xl animate-spin-slow">
              <img
                src={orbitingImages[0].src}
                alt={orbitingImages[0].alt}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                }}
              />
              <div className="absolute -top-10 -left-10 w-16 h-16 animate-orbit-1">
                <div className="w-full h-full rounded-full overflow-hidden shadow-md">
                  <img
                    src={orbitingImages[0].src}
                    alt={orbitingImages[0].alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150?text=Image+Not+Available';
                    }}
                  />
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-14 h-14 animate-orbit-2">
                <div className="w-full h-full rounded-full overflow-hidden shadow-md">
                  <img
                    src={orbitingImages[1].src}
                    alt={orbitingImages[1].alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150?text=Image+Not+Available';
                    }}
                  />
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-12 h-12 animate-orbit-3">
                <div className="w-full h-full rounded-full overflow-hidden shadow-md">
                  <img
                    src={orbitingImages[2].src}
                    alt={orbitingImages[2].alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150?text=Image+Not+Available';
                    }}
                  />
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-10 h-10 animate-orbit-4">
                <div className="w-full h-full rounded-full overflow-hidden shadow-md">
                  <img
                    src={orbitingImages[0].src}
                    alt={orbitingImages[0].alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150?text=Image+Not+Available';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t shadow-lg z-50 animate-slideInUp overflow-y-auto max-h-[80vh]">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-800 font-semibold hover:bg-orange-100 rounded-lg transition-all duration-300 animate-slideInUp"
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                </button>
              ))}
              <div className="relative">
                <button
                  onClick={handleNavOrderClick}
                  className="block w-full text-left px-4 py-3 text-gray-800 font-semibold hover:bg-orange-100 rounded-lg transition-all duration-300 animate-slideInUp"
                  aria-haspopup="true"
                  aria-expanded={showNavOrderOptions}
                >
                  {translations[language].getStarted || 'Get Started'}
                </button>
                {showNavOrderOptions && (
                  <div className="mt-2 w-full bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg shadow-xl overflow-hidden animate-fadeInUp overflow-y-auto max-h-[40vh]">
                    <div className="flex justify-between items-center px-4 py-2 bg-orange-500/50">
                      <h3 className="text-white font-semibold">{translations[language].exploreOptions || 'Explore Options'}</h3>
                      <button
                        onClick={() => setShowNavOrderOptions(false)}
                        className="text-white hover:text-gray-200"
                        aria-label="Close menu"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/start-for-free');
                        setShowNavOrderOptions(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-white font-semibold hover:bg-orange-500 transition-colors"
                    >
                      {translations[language].startForFree || 'Start for Free'}
                    </button>
                    <button
                      onClick={() => {
                        navigate('/track-calories');
                        setShowNavOrderOptions(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-white font-semibold hover:bg-orange-500 transition-colors"
                    >
                      {translations[language].trackCalories || 'Track Calories'}
                    </button>
                    <button
                      onClick={() => {
                        navigate('/meal-planner');
                        setShowNavOrderOptions(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-white font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      {translations[language].planMeals || 'Plan Meals'}
                    </button>
                    <button
                      onClick={() => {
                        navigate('/find-support');
                        setShowNavOrderOptions(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-white font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      {translations[language].findSupport || 'Find Support'}
                    </button>
                  </div>
                )}
              </div>
              <div className="relative group">
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-800 font-semibold hover:bg-orange-100 rounded-lg transition-all duration-300 animate-slideInUp"
                  aria-haspopup="true"
                  aria-expanded={false}
                >
                  <Globe className="w-5 h-5" />
                  {language}
                </button>
                <div className="mt-2 w-full bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg shadow-xl overflow-hidden animate-fadeInUp overflow-y-auto max-h-[40vh]">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className="block w-full text-left px-4 py-2 text-white font-semibold hover:bg-orange-500 transition-colors"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-800 font-semibold hover:bg-orange-100 rounded-lg transition-all duration-300 animate-slideInUp"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    {user.name || 'User'}
                  </button>
                  {showProfileDropdown && (
                    <div className="mt-2 w-full bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-xl overflow-hidden animate-fadeInUp overflow-y-auto max-h-[40vh]">
                      <div className="px-4 py-2 bg-blue-600/50">
                        <h3 className="text-white font-semibold">Profile</h3>
                      </div>
                      <div className="px-4 py-3 text-white">
                        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                        <p><strong>Age:</strong> {user.profile?.age || 'N/A'}</p>
                        <p><strong>Weight:</strong> {user.profile?.weight || 'N/A'} kg</p>
                        <p><strong>Height:</strong> {user.profile?.height || 'N/A'} cm</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-white font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes orbit1 {
          0% { transform: rotate(0deg) translateX(96px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(96px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          0% { transform: rotate(90deg) translateX(96px) rotate(-90deg); }
          100% { transform: rotate(450deg) translateX(96px) rotate(-450deg); }
        }
        @keyframes orbit3 {
          0% { transform: rotate(180deg) translateX(96px) rotate(-180deg); }
          100% { transform: rotate(540deg) translateX(96px) rotate(-540deg); }
        }
        @keyframes orbit4 {
          0% { transform: rotate(270deg) translateX(96px) rotate(-270deg); }
          100% { transform: rotate(630deg) translateX(96px) rotate(-630deg); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(251, 191, 36, 0.8); }
          50% { text-shadow: 0 0 40px rgba(245, 158, 11, 0.8); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInUp { animation: slideInUp 1s ease-out 0.3s both; }
        .animate-slideInLeft { animation: slideInLeft 1.2s ease-out; }
        .animate-orbit-1 { animation: orbit1 20s linear infinite; }
        .animate-orbit-2 { animation: orbit2 25s linear infinite; }
        .animate-orbit-3 { animation: orbit3 30s linear infinite; }
        .animate-orbit-4 { animation: orbit4 35s linear infinite; }
        .animate-spin-slow { animation: spinSlow 20s linear infinite; }
        .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .object-contain {
          padding-top: 6px;
          object-fit: contain;
          margin-top: -10px;
          width: 64px;
          height: auto;
          image-rendering: -webkit-optimize-contrast;
          -ms-interpolation-mode: bicubic;
        }
      `}</style>
    </nav>
  );
});

Header.displayName = 'Header';
export default Header;