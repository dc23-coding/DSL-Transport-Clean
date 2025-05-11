import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GlobalNavControls = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(-1)}
        className="rounded-full shadow-lg"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(1)}
        className="rounded-full shadow-lg"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default GlobalNavControls;
