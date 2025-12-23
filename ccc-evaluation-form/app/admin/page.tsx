"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/admin/StatsCard";
import RecentResponses from "@/components/admin/RecentResponses";
import ExportButton from "@/components/admin/ExportButton";
import dynamic from "next/dynamic";

// Lazy load chart components
const DemographicsCharts = dynamic(
  () => import("@/components/admin/charts/DemographicsCharts"),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
    ),
  }
);
const ServiceQualityCharts = dynamic(
  () => import("@/components/admin/charts/ServiceQualityCharts"),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
    ),
  }
);
const DepartmentCharts = dynamic(
  () => import("@/components/admin/charts/DepartmentCharts"),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
    ),
  }
);
const MinistryCharts = dynamic(
  () => import("@/components/admin/charts/MinistryCharts"),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
    ),
  }
);
const OverallHealthCharts = dynamic(
  () => import("@/components/admin/charts/OverallHealthCharts"),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
    ),
  }
);
import {
  Users,
  Calendar,
  BarChart3,
  FileText,
  TrendingUp,
  HeartPulse,
} from "lucide-react";

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  activeUsers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/responses/stats", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setStats(data as Stats);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial load
    fetchStats();

    // Poll periodically for near real-time updates while the dashboard is open
    const intervalId = setInterval(fetchStats, 10000); // 10s

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back to the detailed overview of performance and data.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Responses"
          value={stats.total}
          icon={FileText}
          color="blue"
          loading={loading}
        />
        <StatsCard
          title="Today's Entries"
          value={stats.today}
          icon={Calendar}
          color="green"
          loading={loading}
        />
        <StatsCard
          title="This Week"
          value={stats.thisWeek}
          icon={TrendingUp}
          color="purple"
          loading={loading}
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Users}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Section 1: Demographics */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Congregation Demographics
            </h2>
          </div>
          <DemographicsCharts />
        </section>

        {/* Section 2: Service Quality */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Service Experience
            </h2>
          </div>
          <ServiceQualityCharts />
        </section>

        {/* Section 3: Department Engagement */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Department Engagement
            </h2>
          </div>
          <DepartmentCharts />
        </section>

        {/* Section 4: Ministry Health */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Ministry Health Check
            </h2>
          </div>
          <MinistryCharts />
        </section>

        {/* Section 5: Overall Health & Innovation */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <HeartPulse className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Overall Church Health
            </h2>
          </div>
          <OverallHealthCharts />
        </section>

        {/* Section 6: Recent Activity & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Responses Table */}
          <div className="lg:col-span-2">
            <RecentResponses />
          </div>

          {/* Quick Actions / Placeholders */}
          <div className="space-y-6">
            <ExportButton />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Database Status</span>
                  <span className="flex items-center text-green-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Backup</span>
                  <span className="text-gray-900 font-medium">Auto-synced</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Version</span>
                  <span className="text-gray-400 font-mono text-xs">
                    v1.0.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
