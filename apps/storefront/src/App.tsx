import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header, SupportPanel } from './components/organisms';

export default function App() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenSupport={() => setIsSupportOpen(true)} />
      
      <main>
        <Outlet />
      </main>

      <SupportPanel 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
      />
    </div>
  );
}
