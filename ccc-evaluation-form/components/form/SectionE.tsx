'use client';

import { memo } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormData } from '@/lib/validations';
import { DebouncedTextArea } from './DebouncedTextArea';

interface SectionEProps {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
}

const SectionE = ({ register, errors }: SectionEProps) => {
    return (
        <div className="space-y-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Section E: Overall Feedback</h2>
            </div>

            {/* 1. Spiritual atmosphere */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        1. How would you describe the overall spiritual atmosphere at CCC? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-4">
                        {['Vibrant', 'Encouraging', 'Neutral', 'Needs Revival'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('spiritualAtmosphere')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.spiritualAtmosphere && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.spiritualAtmosphere.message}</p>
                    )}
                </fieldset>
            </div>

            {/* 2. Exceptional areas */}
            <div>
                <label htmlFor="exceptionalAreas" className="block text-sm font-medium text-gray-700 mb-2">
                    2. What do you believe CCC is doing exceptionally well? <span className="text-red-500">*</span>
                </label>
                <DebouncedTextArea
                    id="exceptionalAreas"
                    registration={register('exceptionalAreas')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[120px] text-gray-900"
                    placeholder="Share what CCC is doing well..."
                    aria-required="true"
                    aria-invalid={errors.exceptionalAreas ? 'true' : 'false'}
                />
                {errors.exceptionalAreas && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.exceptionalAreas.message}</p>
                )}
            </div>

            {/* 3. Urgent improvements */}
            <div>
                <label htmlFor="urgentImprovements" className="block text-sm font-medium text-gray-700 mb-2">
                    3. What area do you believe CCC should focus on improving most urgently? <span className="text-red-500">*</span>
                </label>
                <DebouncedTextArea
                    id="urgentImprovements"
                    registration={register('urgentImprovements')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[120px] text-gray-900"
                    placeholder="Share areas that need urgent improvement..."
                    aria-required="true"
                    aria-invalid={errors.urgentImprovements ? 'true' : 'false'}
                />
                {errors.urgentImprovements && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.urgentImprovements.message}</p>
                )}
            </div>

            {/* 4. Additional thoughts */}
            <div>
                <label htmlFor="additionalThoughts" className="block text-sm font-medium text-gray-700 mb-2">
                    4. Any additional thoughts, comments, or creative ideas to help CCC grow stronger? <span className="text-red-500">*</span>
                </label>
                <DebouncedTextArea
                    id="additionalThoughts"
                    registration={register('additionalThoughts')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[120px] text-gray-900"
                    placeholder="Share any additional thoughts or ideas..."
                    aria-required="true"
                    aria-invalid={errors.additionalThoughts ? 'true' : 'false'}
                />
                {errors.additionalThoughts && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.additionalThoughts.message}</p>
                )}
            </div>
        </div>
    );
};

export default SectionE;
