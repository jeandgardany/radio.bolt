import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  RadioIcon,
  MusicalNoteIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/studio', icon: RadioIcon, label: 'Studio' },
    { path: '/library', icon: MusicalNoteIcon, label: 'Biblioteca' },
    { path: '/schedule', icon: CalendarIcon, label: 'Programação' },
  ];

  return (
    <div className="w-64 bg-radio-blue shadow-lg">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-radio-light">Rádio Gospel</h1>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-radio-text hover:bg-radio-accent transition-colors ${
                isActive ? 'bg-radio-accent text-radio-light' : 'text-radio-text-secondary'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;