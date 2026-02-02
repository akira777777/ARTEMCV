import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Artem Mikhailov
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/detailing-hub" className="text-muted-foreground hover:text-foreground transition-colors">Detailing Hub</Link>
              <Link to="/dental-ecosystem" className="text-muted-foreground hover:text-foreground transition-colors">Dental Ecosystem</Link>
              <Link to="/barbershop-grid" className="text-muted-foreground hover:text-foreground transition-colors">Barbershop Grid</Link>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;