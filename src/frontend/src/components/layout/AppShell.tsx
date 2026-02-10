import { ReactNode } from 'react';
import LoginButton from '../auth/LoginButton';
import { Sprout } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-gold">
              <Sprout className="w-6 h-6 text-brown" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gold via-gold-light to-earth bg-clip-text text-transparent">
                SUZHI
              </h1>
              <p className="text-xs text-muted-foreground">Decentralized Eco-City</p>
            </div>
          </div>
          <LoginButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>© {currentYear} SUZHI</span>
              <span>•</span>
              <span>One Token, One Vote</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Built with</span>
              <span className="text-gold">♥</span>
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
