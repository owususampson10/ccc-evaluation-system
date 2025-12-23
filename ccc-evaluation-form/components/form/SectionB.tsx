'use client';

import { memo } from 'react';
import { UseFormRegister, FieldErrors, useWatch, Control } from 'react-hook-form';
import { FormData } from '@/lib/validations';
import { DebouncedTextArea } from './DebouncedTextArea';

interface SectionBProps {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    control: Control<FormData>;
}

const SectionB = ({ register, errors, control }: SectionBProps) => {
    const timesConvenient = useWatch({ control, name: 'timesConvenient' });

    return (
        <div className="space-y-6">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Section B: Service Experience</h2>
                <p className="text-sm text-gray-600 italic mt-2">
                    Each Sunday, our services include a time of Worship &amp; Preaching, followed by Bible Study to deepen our understanding of God&apos;s Word.
                </p>
            </div>

            {/* 1. Overall Rating */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        1. How would you rate the overall flow and experience of our services? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-4">
                        {['Excellent', 'Good', 'Fair', 'Needs Improvement'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('overallRating')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.overallRating && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.overallRating.message}</p>
                    )}
                </fieldset>
            </div>

            {/* 2. Transition Smoothness */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        2. Is the transition between worship/preaching and Bible Study smooth and well-timed? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-4">
                        {['Yes', 'Somewhat', 'No'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('transitionSmooth')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.transitionSmooth && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.transitionSmooth.message}</p>
                    )}
                </fieldset>
            </div>

            {/* 3. What do you enjoy most */}
            <div>
                <label htmlFor="enjoyMost" className="block text-sm font-medium text-gray-700 mb-2">
                    3. What do you enjoy most about the services? <span className="text-red-500">*</span>
                </label>
                <DebouncedTextArea
                    id="enjoyMost"
                    registration={register('enjoyMost')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[120px] text-gray-900"
                    placeholder="Share what you enjoy most about our services..."
                    aria-required="true"
                    aria-invalid={errors.enjoyMost ? 'true' : 'false'}
                />
                {errors.enjoyMost && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.enjoyMost.message}</p>
                )}
            </div>

            {/* 4. Improvement suggestions */}
            <div>
                <label htmlFor="improveAspects" className="block text-sm font-medium text-gray-700 mb-2">
                    4. What aspects of the services could be improved, and how? <span className="text-red-500">*</span>
                </label>
                <DebouncedTextArea
                    id="improveAspects"
                    registration={register('improveAspects')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[120px] text-gray-900"
                    placeholder="Share your suggestions for improvement..."
                    aria-required="true"
                    aria-invalid={errors.improveAspects ? 'true' : 'false'}
                />
                {errors.improveAspects && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.improveAspects.message}</p>
                )}
            </div>

            {/* 5. Service times convenient */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        5. Are the current service times convenient for you? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex gap-6">
                        {['Yes', 'No'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('timesConvenient')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.timesConvenient && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.timesConvenient.message}</p>
                    )}
                </fieldset>
            </div>

            {/* Conditional: Time suggestions */}
            {timesConvenient === 'No' && (
                <div className="pl-6 border-l-2 border-green-200 animate-fadeIn">
                    <label htmlFor="timeSuggestions" className="block text-sm font-medium text-gray-700 mb-2">
                        If no, please suggest what might work better:
                    </label>
                    <DebouncedTextArea
                        id="timeSuggestions"
                        registration={register('timeSuggestions')}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[100px] text-gray-900"
                        placeholder="Suggest alternative service times..."
                    />
                </div>
            )}
        </div>
    );
};

export default SectionB;
