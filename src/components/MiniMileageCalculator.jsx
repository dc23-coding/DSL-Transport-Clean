import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const MiniMileageCalculator = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!origin || !destination) return;

    const distance = Math.floor(Math.random() * 1000) + 50; // Mock distance in miles
    const time = distance / 50; // 50 mph speed assumption
    setResult({ distance, time: time.toFixed(1) });
  };

  return (
    <div className="glass-effect p-4 rounded-lg shadow-lg space-y-4">
      <h3 className="text-lg font-bold">Route Estimator</h3>
      <input
        type="text"
        placeholder="Enter Origin"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        className="w-full px-3 py-2 rounded-md border bg-background"
      />
      <input
        type="text"
        placeholder="Enter Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="w-full px-3 py-2 rounded-md border bg-background"
      />
      <Button onClick={calculate}>Calculate</Button>
      {result && (
        <div className="mt-2 text-sm text-muted-foreground">
          <p>Distance: {result.distance} miles</p>
          <p>Estimated Time: {result.time} hours</p>
        </div>
      )}
    </div>
  );
};

export default MiniMileageCalculator;
