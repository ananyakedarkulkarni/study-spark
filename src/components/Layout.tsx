import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import StudyTimer from './StudyTimer';
import NoteSidebar from './NoteSidebar';
import { BookOpen, Home, FileText, BookCopy, MessageSquare, Menu, X, StickyNote } from 'lucide-react';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, text, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800'
      }`}
    >
      <div className="mr-3">{icon}</div>
      <span>{text}</span>
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { toggleSidebar } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isHomePage = location.pathname === '/';

  const navLinks = [
    { path: '/', text: 'Home', icon: <Home size={20} /> },
    { path: '/resources', text: 'Resources', icon: <BookOpen size={20} /> },
    { path: '/worksheets', text: 'Worksheets', icon: <FileText size={20} /> },
    { path: '/ai-assistant', text: 'AI Assistant', icon: <MessageSquare size={20} /> },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <BookCopy size={24} className="text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">StudySpark</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                icon={link.icon}
                text={link.text}
                isActive={location.pathname === link.path}
              />
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Notes Toggle */}
          {!isHomePage && (
            <button
              onClick={toggleSidebar}
              className="ml-4 hidden md:flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              <StickyNote size={18} className="mr-2" />
              Notes
            </button>
          )}
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  icon={link.icon}
                  text={link.text}
                  isActive={location.pathname === link.path}
                />
              ))}
              
              {!isHomePage && (
                <button
                  onClick={() => {
                    toggleSidebar();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                >
                  <StickyNote size={20} className="mr-3" />
                  Notes
                </button>
              )}
            </div>
          </nav>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; 2025 StudySpark. All rights reserved.
        </div>
      </footer>
      
      {/* Floating Study Timer */}
      <StudyTimer />
      
      {/* Notes Sidebar - Only show on non-home pages */}
      {!isHomePage && <NoteSidebar />}
    </div>
  );
};

export default Layout;