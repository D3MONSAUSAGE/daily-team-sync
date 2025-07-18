
import React from 'react';
import EmployeeTimeTracking from '@/components/dashboard/EmployeeTimeTracking';

const TimeTrackingPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Time Tracking</h1>
          <p className="text-muted-foreground">
            Professional time management with compliance monitoring and automated controls
          </p>
        </div>
      </div>
      <EmployeeTimeTracking />
    </div>
  );
};

export default TimeTrackingPage;
