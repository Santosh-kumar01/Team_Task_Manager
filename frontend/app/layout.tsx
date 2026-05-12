import './globals.css';
import { Inter } from 'next/font/google';
import StoreProvider from './StoreProvider';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Team Task Manager',
  description: 'Manage your team and tasks efficiently',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <StoreProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{ 
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                color: '#1f2937',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                fontWeight: 'bold',
                padding: '16px 24px',
              },
              success: {
                iconTheme: {
                  primary: '#4f46e5',
                  secondary: '#fff',
                },
              },
            }} 
          />
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
