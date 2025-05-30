import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'CHI SIAMO', href: '/chi-siamo' },
    {
      name: 'TEAM',
      href: '/team',
      submenu: [
        { name: 'PRIMA SQUADRA', href: '/team/prima-squadra' },
        { name: 'UNDER 19', href: '/team/under-19' },
        { name: 'STAFF DIRIGENZIALE', href: '/team/staff-dirigenziale' },
        { name: 'STAFF TECNICO', href: '/team/staff-tecnico' },
      ],
    },
    { name: 'SETTORE GIOVANILE', href: '/settore-giovanile' },
    { name: 'SPONSOR', href: '/sponsor' }, 
    { name: 'CONTATTI', href: '/contatti' },
  ];

  return (
    <header className="fixed w-full top-0 z-50">
      {/* Logo centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-50">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="bg-gradient-to-r from-hyria-primary via-hyria-primary to-hyria-primary">
        <div className="container">
          <div className="flex justify-between h-20">
            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:justify-center w-full">
              {navigation.map((item, index) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className="nav-link px-4 py-2 inline-block"
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="absolute left-0 mt-0 w-64 bg-hyria-primary rounded-b-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          to={subitem.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-hyria-secondary"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-hyria-secondary focus:outline-none"
              >
                {isOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-hyria-primary border-t border-gray-800">
            <div className="container py-3">
              {navigation.map((item) => (
                <div key={item.name} className="py-1">
                  <Link
                    to={item.href}
                    className="block px-4 py-2 text-base font-medium text-white hover:text-hyria-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="pl-4">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          to={subitem.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:text-hyria-secondary"
                          onClick={() => setIsOpen(false)}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;