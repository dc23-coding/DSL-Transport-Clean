import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const MileageCalculator = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [mileage, setMileage] = useState(null);

  const calculateMileage = () => {
    if (!pickup || !destination) {
      setMileage(null);
      return;
    }

    // Mock simple mileage calculation (replace with API if needed)
    const estimatedMileage = Math.floor(Math.random() * 400) + 50; // random 50–450 miles
    setMileage(estimatedMileage);
  };

  return (
    <div className="p-4 border rounded shadow-sm space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Mileage Calculator</h2>
      <input
        type="text"
        placeholder="Pick-up Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="text"
        placeholder="Arrival Location"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <Button onClick={calculateMileage} disabled={!pickup || !destination}>
        Calculate Mileage
      </Button>

      {mileage !== null && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          Estimated Distance: {mileage} miles
        </div>
      )}
    </div>
  );
};

export default MileageCalculator;
