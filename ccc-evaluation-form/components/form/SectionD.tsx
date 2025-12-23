'use client';

import { memo } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormData } from '@/lib/validations';
import { DebouncedTextArea } from './DebouncedTextArea';

interface SectionDProps {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
}

const SectionD = ({ register, errors }: SectionDProps) => {
    return (
        <div className="space-y-6">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Section D: Ministry Functionality</h2>
                <p className="text-sm text-gray-600 italic mt-2">
                    In addition to departments, CCC functions through key ministries such as the Family Life Ministry, Hospitality Ministry, and others (e.g., Ushering, Protocol, Media, Music, Prayer, etc.).
                </p>
            </div>

            {/* 1. Ministries serving */}
            <div>
                <label htmlFor="ministriesServing" className="block text-sm font-medium text-gray-700 mb-2">
                    1. Which ministry or ministries are you currently serving in (if any)? <span className="text-red-500">*</span>
                </label>
                <DebouncedTextArea
                    id="ministriesServing"
                    registration={register('ministriesServing')}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[100px] text-gray-900"
                    placeholder="List the ministries you are currently serving in..."
                    aria-required="true"
                    aria-invalid={errors.ministriesServing ? 'true' : 'false'}
                />
                {errors.ministriesServing && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.ministriesServing.message}</p>
                )}
            </div>

            {/* 2. Ministry teamwork */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        2. How would you rate teamwork and coordination within your ministry? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-4">
                        {['Excellent', 'Good', 'Fair', 'Needs Improvement'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('ministryTeamwork')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.ministryTeamwork && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.ministryTeamwork.message}</p>
                    )}
                </fieldset>
            </div>

            {/* 3. Ministry support */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        3. Does your ministry receive adequate support from leadership and other teams? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-4">
                        {['Yes', 'Sometimes', 'No'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('ministrySupport')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.ministrySupport && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.ministrySupport.message}</p>
                    )}
                </fieldset>
            </div>

            {/* 4. Ministry improvements */}
            <div>
                <label htmlFor="ministryImprovements" className="block text-sm font-medium text-gray-700 mb-2">
                    4. Suggest what can be done to improve your ministry? <span className="text-red-500">*</span>
                </label>
                <DebouncedTextArea
                    id="ministryImprovements"
                    registration={register('ministryImprovements')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[120px] text-gray-900"
                    placeholder="Share your suggestions for improving the ministry..."
                    aria-required="true"
                    aria-invalid={errors.ministryImprovements ? 'true' : 'false'}
                />
                {errors.ministryImprovements && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.ministryImprovements.message}</p>
                )}
            </div>
        </div>
    );
};

export default SectionD;
