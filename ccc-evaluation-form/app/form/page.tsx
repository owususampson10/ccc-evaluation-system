'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/form/ProgressBar';
import SectionA from '@/components/form/SectionA';
import SectionB from '@/components/form/SectionB';
import SectionC from '@/components/form/SectionC';
import SectionD from '@/components/form/SectionD';
import SectionE from '@/components/form/SectionE';
import { formSchema, FormData, sectionASchema, sectionBSchema, sectionCSchema, sectionDSchema, sectionESchema } from '@/lib/validations';

const sectionSchemas = [sectionASchema, sectionBSchema, sectionCSchema, sectionDSchema, sectionESchema];
const sectionLabels = ['A', 'B', 'C', 'D', 'E'];

const FormPage = () => {
    const [mounted, setMounted] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        control,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            childrenDepartments: [],
            serviceAttendance: [],
        },
    });

    // Handle hydration
    useEffect(() => {
        setMounted(true);
    }, []);


    const handleNext = async () => {
        // Get fields for current section
        const currentSchema = sectionSchemas[currentStep - 1];
        const fieldsToValidate = Object.keys(currentSchema.shape) as (keyof FormData)[];

        const isValid = await trigger(fieldsToValidate);

        if (isValid && currentStep < 5) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await fetch('/api/responses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 409) {
                    setSubmitError(errorData.error);
                } else {
                    setSubmitError(errorData.error || 'Failed to submit form');
                }
                return; // Stop execution if there's an error
            }

            setSubmitSuccess(true);
            router.refresh(); // Invalidate cache for real-time sync
            setSubmitError('');
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit form');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNewForm = () => {
        reset();
        setCurrentStep(1);
        setSubmitSuccess(false);
        setSubmitError('');
    };

    // Show loading during hydration to prevent mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading form...</p>
                </div>
            </div>
        );
    }

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Form Submitted Successfully!</h1>
                    <p className="text-gray-600 mb-6">
                        Thank you for completing the evaluation questionnaire. Your feedback is valuable to us.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={handleNewForm}
                            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            aria-label="Enter another form"
                        >
                            Enter Another Form
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">CCC Evaluation Form</h1>
                        <p className="text-sm text-gray-500">Data Entry System</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Logout"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Progress Bar */}
                <ProgressBar
                    currentStep={currentStep}
                    totalSteps={5}
                    labels={sectionLabels}
                />

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    {/* Section Content */}
                    <div className="mb-8">
                        {currentStep === 1 && <SectionA register={register} errors={errors} control={control} />}
                        {currentStep === 2 && <SectionB register={register} errors={errors} control={control} />}
                        {currentStep === 3 && <SectionC register={register} errors={errors} />}
                        {currentStep === 4 && <SectionD register={register} errors={errors} />}
                        {currentStep === 5 && <SectionE register={register} errors={errors} />}
                    </div>

                    {/* Error Message */}
                    {submitError && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
                            {submitError}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className={`px-6 py-3 font-semibold rounded-lg transition-all ${currentStep === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500'
                                }`}
                            aria-label="Previous section"
                        >
                            ← Previous
                        </button>

                        {currentStep < 5 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                                aria-label="Next section"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                aria-label="Submit form"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    'Submit Form ✓'
                                )}
                            </button>
                        )}
                    </div>
                </form>

                {/* Step indicator */}
                <p className="text-center text-gray-500 mt-6">
                    Step {currentStep} of 5
                </p>
            </main>
        </div>
    );
};

export default FormPage;
