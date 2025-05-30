
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Project, TaskStatus } from '@/types';

interface ProjectProgressChartProps {
  projects: Project[];
}

interface ChartData {
  name: string;
  todo: number;
  inProgress: number;
  pending: number;
  completed: number;
}

const PROJECT_COLORS = {
  todo: '#ff8042',
  inProgress: '#ffbb28',
  pending: '#0088fe',
  completed: '#00c49f'
};

const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ projects }) => {
  const chartData = useMemo(() => {
    // Take only the top 5 projects with the most tasks
    return projects
      .filter(project => project.tasks && project.tasks.length > 0)
      .sort((a, b) => b.tasks.length - a.tasks.length)
      .slice(0, 5)
      .map(project => {
        const tasksByStatus = project.tasks.reduce((acc, task) => {
          const status = task.status.toLowerCase().replace(/\s+/g, '');
          acc[status as keyof typeof acc] = (acc[status as keyof typeof acc] || 0) + 1;
          return acc;
        }, { todo: 0, inprogress: 0, pending: 0, completed: 0 });
        
        return {
          name: project.title.length > 12 ? project.title.substring(0, 12) + '...' : project.title,
          todo: tasksByStatus.todo,
          inProgress: tasksByStatus.inprogress,
          pending: tasksByStatus.pending,
          completed: tasksByStatus.completed
        };
      });
  }, [projects]);
  
  if (chartData.length === 0) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center text-gray-500">
        <p>No project data available</p>
      </div>
    );
  }
  
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="todo" stackId="stack" fill={PROJECT_COLORS.todo} name="To Do" />
          <Bar dataKey="inProgress" stackId="stack" fill={PROJECT_COLORS.inProgress} name="In Progress" />
          <Bar dataKey="pending" stackId="stack" fill={PROJECT_COLORS.pending} name="Pending" />
          <Bar dataKey="completed" stackId="stack" fill={PROJECT_COLORS.completed} name="Completed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectProgressChart;
