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

const RATE_COLORS = {
  Excellent: "#22c55e",
  Good: "#3b82f6",
  Fair: "#facc15",
  "Needs Improvement": "#ef4444",
};
const DEFAULT_COLOR = "#94a3b8";

interface ServiceQualityChartsProps {
  data: {
    overallRatings: any[];
    transitionSmoothness: any[];
    convenience: any[];
  };
  healthData: {
    spiritualAtmosphere: any[];
  };
}

const ServiceQualityCharts = ({
  data,
  healthData,
}: ServiceQualityChartsProps) => {
  // Helper to sort ratings logically
  const ratingOrder = ["Excellent", "Good", "Fair", "Needs Improvement"];
  const sortRatings = (a: any, b: any) =>
    ratingOrder.indexOf(a.overallRating) - ratingOrder.indexOf(b.overallRating);

  const overallData = [...data.overallRatings]
    .sort(sortRatings)
    .map((item) => ({
      name: item.overallRating,
      count: item._count,
      fill:
        RATE_COLORS[item.overallRating as keyof typeof RATE_COLORS] ||
        DEFAULT_COLOR,
    }));

  const transitionData = data.transitionSmoothness.map((item) => ({
    name: item.transitionSmooth,
    value: item._count,
  }));

  const convenienceData = data.convenience.map((item) => ({
    name: item.timesConvenient ? "Convenient" : "Inconvenient",
    value: item._count,
  }));

  const spiritData = healthData.spiritualAtmosphere.map((item) => ({
    name: item.spiritualAtmosphere,
    count: item._count,
  }));

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        Service Quality & Experience
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Overall Service Rating
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={overallData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {overallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transition Smoothness */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Worship &rarr; Word Transition
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={transitionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {transitionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#22c55e", "#facc15", "#ef4444"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Service Time Convenience */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Service Time Convenience
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={convenienceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${
                    percent !== undefined ? (percent * 100).toFixed(0) : "0"
                  }%`
                }
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Spiritual Atmosphere */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Spiritual Atmosphere Perception
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={spiritData}
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
                name="Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ServiceQualityCharts;
