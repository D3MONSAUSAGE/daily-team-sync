
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { formatDistance } from 'date-fns';
import { Clock, TimerOff } from 'lucide-react';
import WeeklyTimeReport from './WeeklyTimeReport';

const TimeTracking: React.FC = () => {
  const { currentEntry, clockIn, clockOut, getWeeklyTimeEntries } = useTimeTracking();
  const [notes, setNotes] = useState('');
  const [weeklyEntries, setWeeklyEntries] = useState<any[]>([]);
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const fetchWeeklyEntries = async () => {
      const entries = await getWeeklyTimeEntries();
      setWeeklyEntries(entries);
    };
    fetchWeeklyEntries();
  }, [currentEntry]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentEntry.isClocked && currentEntry.clock_in) {
      interval = setInterval(() => {
        setElapsedTime(formatDistance(new Date(currentEntry.clock_in!), new Date()));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentEntry]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input 
              placeholder="Optional notes" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex-grow"
            />
            {currentEntry.isClocked ? (
              <Button 
                variant="destructive" 
                onClick={() => clockOut(notes)}
                className="w-full md:w-auto"
              >
                <TimerOff className="mr-2 h-4 w-4" /> Clock Out
              </Button>
            ) : (
              <Button 
                onClick={() => clockIn(notes)}
                className="w-full md:w-auto"
              >
                <Clock className="mr-2 h-4 w-4" /> Clock In
              </Button>
            )}
          </div>

          {currentEntry.isClocked && (
            <div className="bg-muted p-3 rounded-md">
              <p>Current Session: {elapsedTime} elapsed</p>
            </div>
          )}
        </CardContent>
      </Card>

      <WeeklyTimeReport entries={weeklyEntries} />
    </div>
  );
};

export default TimeTracking;
