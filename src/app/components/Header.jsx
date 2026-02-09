import { Building2, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import userPool from '../../Services/Cognito/Userpool';
import { logout } from '../../Services/Cognito/logout';

export function Header({ user, onAuthClick, onNavigate, currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dataUser, setDataUser] = useState({});
  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Buy', value: 'buy' },
    { label: 'Rent', value: 'rent' },
    { label: 'Sell', value: 'sell' },
  ];

const handleLogout = () => {
  logout();
  sessionStorage.clear();
  window.location.reload(); // quick sync
};

  useEffect(() => {
    const user = userPool.getCurrentUser();
    if (!user) return;

    user.getSession((err, session) => {
      if (err || !session?.isValid()) return;

      user.getUserAttributes((err, attributes) => {
        if (err) return;

        const data = {};
        attributes.forEach(attr => {
          data[attr.getName()] = attr.getValue();
        });

        setUserData(data);
      });
    });
  }, []);
     
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80"
          >
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              EstateHub
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`text-sm ${
                  currentPage === item.value
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:block">
            {user ? (
              <span className="text-sm font-medium text-gray-700">
                Hi, {user.name}
                <Button className="ms-2" onClick={handleLogout}>
                  Logout
                </Button>
              </span>
            ) : (
              <Button onClick={onAuthClick}>
                Sign In / Register
              </Button>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {navItems.map(item => (
                <button
                  key={item.value}
                  onClick={() => {
                    onNavigate(item.value);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm text-gray-600 hover:text-gray-900"
                >
                  {item.label}
                </button>
              ))}

              {!userData && (
                <Button onClick={onAuthClick} className="w-full">
                  Sign In / Register
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
