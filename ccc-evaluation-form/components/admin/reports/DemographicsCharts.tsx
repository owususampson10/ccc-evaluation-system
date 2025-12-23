"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

interface DemographicsChartsProps {
  data: {
    ageGroups: any[];
    gender: any[];
    serviceAttendance: any[];
    memberStatus: any[];
  };
}

const DemographicsCharts = ({ data }: DemographicsChartsProps) => {
  // Format data for Recharts
  const genderData = data.gender.map((item) => ({
    name: item.gender,
    value: item._count,
  }));
  const memberData = data.memberStatus.map((item) => ({
    name: item.isMember ? "Member" : "Visitor",
    value: item._count,
  }));
  const ageData = data.ageGroups.map((item) => ({
    name: item.ageGroup || "Unknown",
    count: item._count,
  }));
  const serviceData = data.serviceAttendance.map((item) => {
    // Simple formatter for service names
    let name = item.serviceAttendance;
    if (name.includes("1st")) name = "1st Svc";
    else if (name.includes("2nd")) name = "2nd Svc";
    else if (name.includes("3rd")) name = "3rd Svc";
    return { name, count: item._count };
  });

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        Congregation Demographics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gender Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Gender Ratio
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${
                    percent !== undefined ? (percent * 100).toFixed(0) : "0"
                  }%`
                }
              >
                {genderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Member Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Member vs Visitor
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={memberData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${
                    percent !== undefined ? (percent * 100).toFixed(0) : "0"
                  }%`
                }
              >
                {memberData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#4ade80" : "#fb923c"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Age Group Distribution
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ageData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Respondents"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service Attendance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Service Attendance
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={serviceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Bar
                dataKey="count"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                name="Attendees"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DemographicsCharts;
