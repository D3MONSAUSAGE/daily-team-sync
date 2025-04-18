
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectReports from '@/components/reports/ProjectReports';
import TeamReports from '@/components/reports/TeamReports';
import TaskReports from '@/components/reports/TaskReports';
import { useIsMobile } from '@/hooks/use-mobile';

const ReportsPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>
      
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-4 w-full flex justify-between md:justify-start md:w-auto overflow-x-auto">
          <TabsTrigger value="tasks" className="flex-1 md:flex-none">Tasks</TabsTrigger>
          <TabsTrigger value="projects" className="flex-1 md:flex-none">Projects</TabsTrigger>
          <TabsTrigger value="team" className="flex-1 md:flex-none">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="space-y-4">
          <TaskReports />
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
          <ProjectReports />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <TeamReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
