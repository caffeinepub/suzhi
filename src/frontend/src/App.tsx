import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUser';
import LoginButton from './components/auth/LoginButton';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import Dashboard from './pages/Dashboard';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Initializing SUZHI...</p>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show login screen for unauthenticated users
  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-gold via-gold-light to-earth bg-clip-text text-transparent">
                  SUZHI
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Decentralized Eco-City
              </p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Building a self-sustaining spiritual eco-city for the next generation. 
                Join our community powered by blockchain governance and proof of contribution.
              </p>
            </div>
            
            <div className="pt-8">
              <LoginButton />
            </div>

            <div className="pt-12 space-y-2 text-xs text-muted-foreground">
              <p>Powered by Internet Computer</p>
              <p>One Token, One Vote • Transparent Governance</p>
            </div>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show profile setup modal if user hasn't set up their profile yet
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background">
        {showProfileSetup && <ProfileSetupModal />}
        <Dashboard />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
