import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TimeMetricsChartProps {
  data?: Array<{
    date: string;
    minutes: number;
    category?: string;
  }>;
  categories?: string[];
}

const defaultCategories = [
  "Study",
  "Research",
  "Writing",
  "Reading",
  "Project Work",
];

const defaultDailyData: Array<{
  date: string;
  minutes: number;
  category?: string;
}> = [];

const defaultWeeklyData: Array<{
  date: string;
  minutes: number;
  category?: string;
}> = [];

const defaultMonthlyData: Array<{
  date: string;
  minutes: number;
  category?: string;
}> = [];

const TimeMetricsChart: React.FC<TimeMetricsChartProps> = ({
  data = defaultDailyData,
  categories = defaultCategories,
}) => {
  const [timeframe, setTimeframe] = useState("daily");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Select data based on timeframe
  const getTimeframeData = () => {
    switch (timeframe) {
      case "daily":
        return defaultDailyData;
      case "weekly":
        return defaultWeeklyData;
      case "monthly":
        return defaultMonthlyData;
      default:
        return defaultDailyData;
    }
  };

  // Filter data by category if selected
  const filteredData = selectedCategory
    ? getTimeframeData().filter((item) => item.category === selectedCategory)
    : getTimeframeData();

  // Format minutes to hours and minutes for tooltip
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Study Time Metrics
          </CardTitle>
          <div className="flex space-x-2">
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) =>
                setSelectedCategory(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="daily"
          value={timeframe}
          onValueChange={setTimeframe}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="daily" className="relative z-10">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="relative z-10">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="relative z-10">
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis
                  label={{
                    value: "Minutes",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={(value) => formatMinutes(Number(value))} />
                <Legend />
                <Bar
                  dataKey="minutes"
                  name="Study Time"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly" className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis
                  label={{
                    value: "Minutes",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={(value) => formatMinutes(Number(value))} />
                <Legend />
                <Bar
                  dataKey="minutes"
                  name="Study Time"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis
                  label={{
                    value: "Minutes",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={(value) => formatMinutes(Number(value))} />
                <Legend />
                <Bar
                  dataKey="minutes"
                  name="Study Time"
                  fill="#ffc658"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TimeMetricsChart;
