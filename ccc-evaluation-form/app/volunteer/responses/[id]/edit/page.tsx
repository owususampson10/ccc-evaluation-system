"use client";

import { useState, useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import Link from "next/link";

import ProgressBar from "@/components/form/ProgressBar";
import SectionA from "@/components/form/SectionA";
import SectionB from "@/components/form/SectionB";
import SectionC from "@/components/form/SectionC";
import SectionD from "@/components/form/SectionD";
import SectionE from "@/components/form/SectionE";
import Toast from "@/components/ui/Toast";
import {
  formSchema,
  FormData,
  sectionASchema,
  sectionBSchema,
  sectionCSchema,
  sectionDSchema,
  sectionESchema,
} from "@/lib/validations";

const sectionSchemas = [
  sectionASchema,
  sectionBSchema,
  sectionCSchema,
  sectionDSchema,
  sectionESchema,
];
const sectionLabels = ["A", "B", "C", "D", "E"];

export default function VolunteerEditResponsePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      serviceAttendance: [],
      childrenDepartments: [],
    },
  });

  // Set mounted state to true after initial render
  useEffect(() => {
    setIsMounted(true);
    return () => {
      // Cleanup function to reset mount state
      setIsMounted(false);
    };
  }, []);

  // Fetch response data
  useEffect(() => {
    let isMounted = true;

    const fetchResponse = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/responses/${id}`, {
          cache: "no-store", // Ensure fresh data on each load
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();

          // Only update form if component is still mounted
          if (isMounted) {
            // Map database values back to form values
            const formValues: any = {
              ...data,
              // Fix types
              isMember: data.isMember ? "Yes" : "No",
              membershipCode: data.membershipCode || "",
              isRegularVisitor: data.isRegularVisitor === true ? "Yes" : "No",
              hasChildren: data.hasChildren ? "Yes" : "No",
              timesConvenient: data.timesConvenient ? "Yes" : "No",
              timeSuggestions: data.timeSuggestions || "",
              // Arrays
              serviceAttendance: data.serviceAttendance
                ? Array.isArray(data.serviceAttendance)
                  ? data.serviceAttendance
                  : data.serviceAttendance.split(", ").filter(Boolean)
                : [],
              childrenDepartments: data.childrenDepartments
                ? Array.isArray(data.childrenDepartments)
                  ? data.childrenDepartments
                  : JSON.parse(data.childrenDepartments)
                : [],
            };

            // Reset form with new values
            reset(formValues, {
              keepDefaultValues: false,
              keepValues: false,
              keepDirty: false,
              keepIsSubmitted: false,
              keepTouched: false,
              keepIsValid: false,
              keepSubmitCount: false,
            });
          }
        } else if (!res.ok && isMounted) {
          setToast({ message: "Failed to load response data", type: "error" });
        }
      } catch (error) {
        console.error("Error fetching response:", error);
        if (isMounted) {
          setToast({
            message: "An error occurred while loading data",
            type: "error",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchResponse();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [id, reset]);

  const handleStepClick = (step: number) => {
    // In edit mode, allow free navigation between steps
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = async () => {
    const currentSchema = sectionSchemas[currentStep - 1];
    const fieldsToValidate = Object.keys(
      currentSchema.shape
    ) as (keyof FormData)[];
    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/responses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setToast({ message: "Response updated successfully", type: "success" });
        // Redirect after brief delay
        setTimeout(() => {
          router.push(`/volunteer/responses/${id}`);
          router.refresh();
          router.refresh();
        }, 1500);
      } else {
        const errorData = await response.json();
        setToast({
          message: errorData.error || "Failed to update response",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ message: "An unexpected error occurred", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const onInvalid = (errors: FieldErrors<FormData>) => {
    // Create a user-friendly error message
    const errorCount = Object.keys(errors).length;
    if (errorCount === 0) {
      setToast({
        message:
          "Validation failed. Please review all form sections for missing fields.",
        type: "error",
      });
    } else {
      const firstErrorField = Object.keys(errors)[0];
      setToast({
        message: `Please fix ${errorCount} error${
          errorCount > 1 ? "s" : ""
        } (e.g., in ${firstErrorField})`,
        type: "error",
      });
    }
    console.error("Form validation errors:", JSON.stringify(errors, null, 2));
  };

  // Show loading state only on initial load
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading response data...</p>
        </div>
      </div>
    );
  }

  // Ensure the component is mounted and hydrated before rendering the form
  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href={`/volunteer/responses/${id}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Cancel and Go Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Editing Response{" "}
            <span className="text-gray-400 font-mono">#{id.slice(-6)}</span>
          </h1>
        </div>
      </div>

      {/* Edit Warning Banner */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="text-amber-600 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-amber-800">You are in Edit Mode</p>
          <p className="text-sm text-amber-700">
            Changes will be saved to the database and your username will be
            recorded as the editor.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={5}
        labels={sectionLabels}
        onStepClick={handleStepClick}
      />

      {/* Form */}
      <form
        key={`form-${id}`} // Force re-render when ID changes
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
      >
        <div className="mb-8">
          {currentStep === 1 && (
            <SectionA register={register} errors={errors} control={control} />
          )}
          {currentStep === 2 && (
            <SectionB register={register} errors={errors} control={control} />
          )}
          {currentStep === 3 && (
            <SectionC register={register} errors={errors} />
          )}
          {currentStep === 4 && (
            <SectionD register={register} errors={errors} />
          )}
          {currentStep === 5 && (
            <SectionE register={register} errors={errors} />
          )}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all ${
              currentStep === 1
                ? "bg-gray-50 text-gray-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ← Previous
          </button>

          <div className="flex gap-3">
            <Link
              href={`/volunteer/responses/${id}`}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </Link>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes ✓
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      <p className="text-center text-gray-400 mt-6 text-sm">
        Section {currentStep} of 5
      </p>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
