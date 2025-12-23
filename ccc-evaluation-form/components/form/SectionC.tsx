'use client';

import { memo } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormData } from '@/lib/validations';
import { DebouncedTextArea } from './DebouncedTextArea';

interface SectionCProps {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
}

const SectionC = ({ register, errors }: SectionCProps) => {
    return (
        <div className="space-y-6">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Section C: Departmental Involvement</h2>
                <p className="text-sm text-gray-600 italic mt-2">
                    CCC has active departments such as Men&apos;s Ministry, Women&apos;s Ministry (CLM), Youth Ministry (Young Adults), and Children&apos;s Ministry.
                </p>
            </div>

            {/* 1. Departments involved */}
            <div>
                <label htmlFor="departmentsInvolved" className="block text-sm font-medium text-gray-700 mb-2">
                    1. Which department(s) are you involved in? <span className="text-red-500">*</span>
                </label>
                <DebouncedTextArea
                    id="departmentsInvolved"
                    registration={register('departmentsInvolved')}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[100px] text-gray-900"
                    placeholder="List the departments you are involved in..."
                    aria-required="true"
                    aria-invalid={errors.departmentsInvolved ? 'true' : 'false'}
                />
                {errors.departmentsInvolved && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.departmentsInvolved.message}</p>
                )}
            </div>

            {/* 2. Department activity level */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        2. How would you describe your department&apos;s level of activity and support? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-4">
                        {['Very Active', 'Active', 'Not Active'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('departmentActivity')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.departmentActivity && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.departmentActivity.message}</p>
                    )}
                </fieldset>
            </div>

            {/* 3. Department effectiveness */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        3. How effectively does your department help members grow spiritually and build meaningful relationships? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-4">
                        {['Excellent', 'Good', 'Fair', 'Needs Improvement'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('departmentEffectiveness')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.departmentEffectiveness && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.departmentEffectiveness.message}</p>
                    )}
                </fieldset>
            </div>

            {/* 4. Department improvements */}
            <div>
                <label htmlFor="departmentImprovements" className="block text-sm font-medium text-gray-700 mb-2">
                    4. What could be done to make your department more effective and engaging? <span className="text-red-500">*</span>
                </label>
                <DebouncedTextArea
                    id="departmentImprovements"
                    registration={register('departmentImprovements')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[120px] text-gray-900"
                    placeholder="Share your suggestions for improving the department..."
                    aria-required="true"
                    aria-invalid={errors.departmentImprovements ? 'true' : 'false'}
                />
                {errors.departmentImprovements && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.departmentImprovements.message}</p>
                )}
            </div>
        </div>
    );
};

export default SectionC;
