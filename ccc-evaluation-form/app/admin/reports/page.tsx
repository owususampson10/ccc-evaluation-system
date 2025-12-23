"use client";

import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Download,
  BarChart2,
  Users,
  Heart,
  Activity,
} from "lucide-react";
import OverviewStats from "@/components/admin/reports/OverviewStats";
import DemographicsCharts from "@/components/admin/reports/DemographicsCharts";
import ServiceQualityCharts from "@/components/admin/reports/ServiceQualityCharts";
import EngagementCharts from "@/components/admin/reports/EngagementCharts";

type Tab = "overview" | "demographics" | "quality" | "engagement";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Type definitions for the report data
interface ReportData {
  summary?: {
    total: number;
  };
  demographics?: {
    gender: Array<{ gender: string; _count: number }>;
    memberStatus: Array<{ isMember: boolean; _count: number }>;
    ageGroups: Array<{ ageGroup: string; _count: number }>;
    serviceAttendance: Array<{ serviceAttendance: string; _count: number }>;
  };
  serviceQuality?: {
    overallRatings: Array<{ overallRating: string; _count: number }>;
    transitionSmoothness: Array<{ transitionSmooth: string; _count: number }>;
    convenience: Array<{ timesConvenient: boolean; _count: number }>;
  };
  health?: {
    spiritualAtmosphere: Array<{ spiritualAtmosphere: string; _count: number }>;
  };
  engagement?: {
    departmentActivity: Array<{ departmentActivity: string; _count: number }>;
    ministryTeamwork: Array<{ ministryTeamwork: string; _count: number }>;
  };
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      if (!res.ok) throw new Error("Failed to fetch data");
      const jsonData: ReportData = await res.json();
      setData(jsonData);
    } catch (err) {
      console.error(err);
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: Tab;
    label: string;
    icon: any;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
        activeTab === id
          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl my-8 mx-4">
        <p>{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    let finalY = 26; // Track the Y position for dynamic content flow

    // Title
    doc.setFontSize(18);
    doc.text("Calvary Charismatic Centre (CCC)", 14, 16);
    doc.setFontSize(14);
    doc.text("Analytics & Reports", 14, finalY);
    finalY += 20;

    // Helper function to add a table with proper spacing
    const addTable = (
      head: string[][],
      body: (string | number)[][],
      startY?: number
    ) => {
      const tableOptions = {
        head,
        body,
        startY,
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        margin: { top: 10 },
      };

      (doc as any).autoTable(tableOptions);
      return (doc as any).lastAutoTable?.finalY || finalY + 50; // Fallback if lastAutoTable is undefined
    };

    // Handle Overview tab
    if (activeTab === "overview") {
      doc.setFontSize(12);
      finalY =
        addTable(
          [["Metric", "Value"]],
          [["Total Responses", data.summary?.total?.toString() || "0"]],
          finalY + 5
        ) + 10;

      if (data.demographics?.gender?.length) {
        doc.text("Gender Distribution", 14, finalY);
        finalY =
          addTable(
            [["Gender", "Count"]],
            data.demographics.gender.map((g) => [
              g.gender,
              g._count.toString(),
            ]),
            finalY + 7
          ) + 10;
      }

      if (data.demographics?.ageGroups?.length) {
        doc.text("Age Groups", 14, finalY);
        finalY =
          addTable(
            [["Age Group", "Count"]],
            data.demographics.ageGroups.map((a) => [
              a.ageGroup,
              a._count.toString(),
            ]),
            finalY + 7
          ) + 10;
      }
    }
    // Handle other tabs similarly...
    else if (activeTab === "demographics") {
      // ... existing demographic table code ...
    } else if (activeTab === "quality") {
      // ... existing quality table code ...
    } else if (activeTab === "engagement") {
      // ... existing engagement table code ...
    }

    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
      doc.text(
        new Date().toLocaleDateString(),
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );
    }

    doc.save(`ccc-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Safe data access with defaults
  const summary = data?.summary || { total: 0 };
  const demographics = data?.demographics || {
    gender: [],
    memberStatus: [],
    ageGroups: [],
    serviceAttendance: [],
  };
  const serviceQuality = data?.serviceQuality || {
    overallRatings: [],
    transitionSmoothness: [],
    convenience: [],
  };
  const healthData = data?.health || { spiritualAtmosphere: [] };
  const engagement = data?.engagement || {
    departmentActivity: [],
    ministryTeamwork: [],
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics & Reports
          </h1>
          <p className="text-gray-500">
            Deep dive into congregation feedback and trends.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        <TabButton id="overview" label="Overview" icon={BarChart2} />
        <TabButton id="demographics" label="Demographics" icon={Users} />
        <TabButton id="quality" label="Service Quality" icon={Activity} />
        <TabButton id="engagement" label="Engagement" icon={Heart} />
      </div>

      {/* Content */}
      <div className="min-h-[500px] animate-fadeIn">
        {/* Wrap the tab content switch in a fragment to avoid JSX parsing errors */}
        <>
          {activeTab === "overview" && (
            <div className="space-y-8">
              <OverviewStats summary={summary} />
              <DemographicsCharts data={demographics} />
            </div>
          )}
          {activeTab === "demographics" && (
            <DemographicsCharts data={demographics} />
          )}
          {activeTab === "quality" && (
            <ServiceQualityCharts
              data={serviceQuality}
              healthData={healthData}
            />
          )}
          {activeTab === "engagement" && <EngagementCharts data={engagement} />}
        </>
      </div>
    </div>
  );
}

// Icon helper since I missed importing Star in the component body
import { Star as StarIcon } from "lucide-react";
