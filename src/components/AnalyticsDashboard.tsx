import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Download, Calendar, BarChart2, PieChart } from "lucide-react";
import TimeMetricsChart from "./TimeMetricsChart";
import GoalTracker from "./GoalTracker";

interface AnalyticsDashboardProps {
  userData?: {
    totalStudyTime: number;
    sessionsCompleted: number;
    averageSessionLength: number;
    mostProductiveDay: string;
  };
  showExport?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  userData = {
    totalStudyTime: 0, // in minutes
    sessionsCompleted: 0,
    averageSessionLength: 0, // in minutes
    mostProductiveDay: "-",
  },
  showExport = true,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Format minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="w-full h-full bg-gray-50 p-4 rounded-lg overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Study Analytics</h2>
          <p className="text-gray-500">
            Track your study patterns and progress
          </p>
        </div>
        {showExport && (
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Export Data</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Study Time"
          value={formatTime(userData.totalStudyTime)}
          icon={<Clock />}
        />
        <StatCard
          title="Sessions Completed"
          value={userData.sessionsCompleted.toString()}
          icon={<Calendar />}
        />
        <StatCard
          title="Avg. Session Length"
          value={formatTime(userData.averageSessionLength)}
          icon={<BarChart2 />}
        />
        <StatCard
          title="Most Productive Day"
          value={userData.mostProductiveDay}
          icon={<PieChart />}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview" className="relative z-10">
            Time Overview
          </TabsTrigger>
          <TabsTrigger value="goals" className="relative z-10">
            Study Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <TimeMetricsChart />
        </TabsContent>

        <TabsContent value="goals">
          <GoalTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Simple clock icon component
const Clock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default AnalyticsDashboard;
