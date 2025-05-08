import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-provider'; // Updated import
import { MoonIcon, SunIcon } from 'lucide-react';

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Simple toggle between light and dark, ignoring 'system' for direct toggle
    // You can expand this logic if you want to cycle through 'light', 'dark', 'system'
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className='hover:bg-primary hover:text-primary-foreground'
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground hover:text-primary-foreground" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
    </Button>
  );
};