import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-6 mt-12">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
          Built with <Heart className="h-4 w-4 text-red-400 fill-current" /> by Mohammed Faizal, 
          <span className="text-foreground/80">2nd year B.Com student, The New College, Chennai.</span>
        </p>
      </div>
    </footer>
  );
};
