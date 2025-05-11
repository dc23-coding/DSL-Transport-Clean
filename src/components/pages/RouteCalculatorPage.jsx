import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const RouteCalculatorPage = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const calculateRoute = async () => {
    setError('');
    setResult(null);

    if (!pickup || !destination || !pickupTime || !dropoffTime) {
      setError('Please fill all fields');
      return;
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('User not authenticated');

      // Mocked data
      const distanceMiles = 380;
      const durationSeconds = 6 * 3600;
      const eta = new Date(new Date(pickupTime).getTime() + durationSeconds * 1000).toLocaleString();
      const fuelCost = 50;
      const weather = 'Sunny, 72°F';

      const { error: dbError } = await supabase.from('routes').insert({
        user_id: user.id,
        pickup,
        destination,
        pickup_time: pickupTime,
        dropoff_time: dropoffTime,
        distance: distanceMiles,
        eta,
        fuel_cost: fuelCost,
      });

      if (dbError) throw new Error('Supabase error: ' + dbError.message);

      setResult({
        pickup,
        destination,
        pickupTime: new Date(pickupTime).toLocaleString(),
        dropoffTime: new Date(dropoffTime).toLocaleString(),
        distance: distanceMiles,
        eta: `${Math.floor(durationSeconds / 3600)}h ${Math.floor((durationSeconds % 3600) / 60)}m`,
        fuelCost: fuelCost.toFixed(2),
        weather,
      });

      toast({ title: 'Route calculation saved' });

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Route Calculator</h2>

      <div className="space-y-4">
        <input type="text" placeholder="Pick-up Location" value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full px-3 py-2 border rounded" />
        <input type="text" placeholder="Arrival Location" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-3 py-2 border rounded" />
        <input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full px-3 py-2 border rounded" />
        <input type="datetime-local" value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} className="w-full px-3 py-2 border rounded" />

        <Button onClick={calculateRoute} disabled={!pickup || !destination || !pickupTime || !dropoffTime}>
          Calculate
        </Button>

        {result && (
          <div className="mt-4 p-4 border rounded">
            <p><strong>Pick-up:</strong> {result.pickup} at {result.pickupTime}</p>
            <p><strong>Arrival:</strong> {result.destination} at {result.dropoffTime}</p>
            <p><strong>Distance:</strong> {result.distance} miles</p>
            <p><strong>ETA:</strong> {result.eta}</p>
            <p><strong>Fuel Cost:</strong> ${result.fuelCost}</p>
            <p><strong>Weather:</strong> {result.weather}</p>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default RouteCalculatorPage;
