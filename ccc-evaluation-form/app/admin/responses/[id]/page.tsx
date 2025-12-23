"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Printer,
  Download,
  Trash2,
  Edit2,
  History,
} from "lucide-react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import Toast from "@/components/ui/Toast";

interface ResponseDetail {
  id: string;
  createdAt: string;
  enteredBy: string;
  lastEditedBy?: string | null;
  lastEditedAt?: string | null;

  // Section A
  ageGroup: string;
  gender: string;
  serviceAttendance: string;
  isMember: boolean;
  membershipCode: string | null;
  isRegularVisitor: boolean | null;
  hasChildren: boolean;
  childrenDepartments: string; // JSON string

  // Section B
  overallRating: string;
  transitionSmooth: string;
  enjoyMost: string;
  improveAspects: string;
  timesConvenient: boolean;
  timeSuggestions: string | null;

  // Section C
  departmentsInvolved: string;
  departmentActivity: string;
  departmentEffectiveness: string;
  departmentImprovements: string;

  // Section D
  ministriesServing: string;
  ministryTeamwork: string;
  ministrySupport: string;
  ministryImprovements: string;

  // Section E
  spiritualAtmosphere: string;
  exceptionalAreas: string;
  urgentImprovements: string;
  additionalThoughts: string;
}

const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 detail-section">
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        {children}
      </div>
    </div>
  </div>
);

const DetailItem = ({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}) => (
  <div
    className={`${
      fullWidth ? "md:col-span-2 full-width-text" : ""
    } detail-item`}
  >
    <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
    <div className="text-gray-700 whitespace-pre-wrap">
      {value || <span className="text-gray-400 italic">Not specified</span>}
    </div>
  </div>
);

export default function ResponseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [response, setResponse] = useState<ResponseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/responses/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Success - redirect immediately as requested
        router.push("/admin/responses");
        router.refresh();
        router.refresh();
      } else {
        const error = await res.json();
        setToast({
          message: error.error || "Failed to delete response",
          type: "error",
        });
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting response:", error);
      setToast({ message: "An error occurred while deleting", type: "error" });
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const res = await fetch(`/api/responses/${id}`);
        if (res.ok) {
          const data = await res.json();
          setResponse(data);
        } else {
          // Handle error
          console.error("Failed to find response");
        }
      } catch (error) {
        console.error("Error fetching response:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading response details...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">Response Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">
          The requested response could not be loaded.
        </p>
        <Link
          href="/admin/responses"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Responses
        </Link>
      </div>
    );
  }

  const childrenDepts = response.childrenDepartments
    ? JSON.parse(response.childrenDepartments)
    : [];

  return (
    <div className="response-details-print-wrapper max-w-5xl mx-auto space-y-6">
      {/* Print Header */}
      <div className="print-header hidden">
        <h1 className="text-xl font-bold text-center mb-2">
          CALVARY CHARISMATIC CENTRE (CCC)
        </h1>
        <h2 className="text-lg text-center mb-4">
          GENERAL EVALUATION QUESTIONNAIRE
        </h2>
        <h3 className="text-md text-center mb-4">
          Response Details - #{response.id.slice(-6)}
        </h3>
        <hr className="mb-4" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <Link
            href="/admin/responses"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2 transition-colors back-button"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to All Responses
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            Response Details
            <span className="text-sm font-normal font-mono px-2 py-1 bg-gray-100 rounded text-gray-500">
              #{response.id.slice(-6)}
            </span>
          </h1>
        </div>
        <div className="flex gap-2 print-hide-buttons">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            <Printer size={16} />
            Print
          </button>
          <Link
            href={`/admin/responses/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 shadow-sm transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Print-only Meta Info */}
      <div className="meta-info-print hidden">
        <div>
          <p>Date Submitted</p>
          <p>
            {new Date(response.createdAt).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <p>Time</p>
          <p>
            {new Date(response.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
        <div>
          <p>Entered By</p>
          <p>{response.enteredBy}</p>
        </div>
        {response.lastEditedBy && (
          <div>
            <p>Last Edited By</p>
            <p>
              {response.lastEditedBy} (
              {new Date(response.lastEditedAt!).toLocaleDateString()})
            </p>
          </div>
        )}
      </div>

      {/* Content Sections */}
      <DetailSection title="Section A: Personal Information">
        <DetailItem label="Age Group" value={response.ageGroup} />
        <DetailItem label="Gender" value={response.gender} />
        <DetailItem
          label="Service Attendance"
          value={response.serviceAttendance}
        />
        <DetailItem
          label="Member Status"
          value={
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${
                response.isMember
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {response.isMember ? "Member" : "Non-Member / Visitor"}
            </span>
          }
        />
        {response.isMember && (
          <DetailItem label="Membership Code" value={response.membershipCode} />
        )}
        {!response.isMember && response.isRegularVisitor !== null && (
          <DetailItem
            label="Regular Visitor"
            value={response.isRegularVisitor ? "Yes" : "No"}
          />
        )}
        <DetailItem
          label="Has Children"
          value={response.hasChildren ? "Yes" : "No"}
        />
        {response.hasChildren && (
          <DetailItem
            label="Children Departments"
            value={
              childrenDepts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {childrenDepts.map((dept: string) => (
                    <span
                      key={dept}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              ) : (
                "None selected"
              )
            }
          />
        )}
      </DetailSection>

      <DetailSection title="Section B: Service Experience">
        <DetailItem
          label="Overall Rating"
          value={
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-bold ${
                  response.overallRating === "Excellent"
                    ? "text-green-600"
                    : response.overallRating === "Good"
                    ? "text-blue-600"
                    : "text-orange-600"
                }`}
              >
                {response.overallRating}
              </span>
            </div>
          }
        />
        <DetailItem
          label="Transition Smoothness"
          value={response.transitionSmooth}
        />
        <DetailItem
          label="Convenient Times"
          value={response.timesConvenient ? "Yes" : "No"}
        />
        {!response.timesConvenient && (
          <DetailItem
            label="Time Suggestions"
            value={response.timeSuggestions}
          />
        )}
        <DetailItem label="Enjoyed Most" value={response.enjoyMost} fullWidth />
        <DetailItem
          label="Improvement Aspects"
          value={response.improveAspects}
          fullWidth
        />
      </DetailSection>

      <DetailSection title="Section C: Departmental Involvement">
        <DetailItem
          label="Departments Involved"
          value={response.departmentsInvolved}
          fullWidth
        />
        <DetailItem
          label="Activity Level"
          value={response.departmentActivity}
        />
        <DetailItem
          label="Effectiveness Rating"
          value={response.departmentEffectiveness}
        />
        <DetailItem
          label="Department Improvements"
          value={response.departmentImprovements}
          fullWidth
        />
      </DetailSection>

      <DetailSection title="Section D: Ministry Functionality">
        <DetailItem
          label="Ministries Serving"
          value={response.ministriesServing}
          fullWidth
        />
        <DetailItem label="Teamwork Rating" value={response.ministryTeamwork} />
        <DetailItem
          label="Leadership Support"
          value={response.ministrySupport}
        />
        <DetailItem
          label="Ministry Improvements"
          value={response.ministryImprovements}
          fullWidth
        />
      </DetailSection>

      <DetailSection title="Section E: Overall Feedback">
        <DetailItem
          label="Spiritual Atmosphere"
          value={response.spiritualAtmosphere}
        />
        <DetailItem
          label="Exceptional Areas"
          value={response.exceptionalAreas}
          fullWidth
        />
        <DetailItem
          label="Urgent Improvements"
          value={response.urgentImprovements}
          fullWidth
        />
        <DetailItem
          label="Additional Thoughts"
          value={response.additionalThoughts}
          fullWidth
        />
      </DetailSection>

      {/* Custom Components */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Print Footer */}
      <div className="print-footer hidden text-sm text-gray-600 mt-8 flex justify-between">
        <span>Response ID: #{response.id.slice(-6)}</span>
        <span>
          Page <span className="pageNumber"></span> of{" "}
          <span className="totalPages"></span>
        </span>
        <span>
          Printed:{" "}
          {new Date().toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
