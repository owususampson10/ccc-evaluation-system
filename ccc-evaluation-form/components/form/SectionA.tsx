'use client';

import { memo } from 'react';
import { UseFormRegister, FieldErrors, useWatch, Control } from 'react-hook-form';
import { FormData } from '@/lib/validations';

interface SectionAProps {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    control: Control<FormData>;
}

const SectionA = ({ register, errors, control }: SectionAProps) => {
    const isMember = useWatch({ control, name: 'isMember' });
    const hasChildren = useWatch({ control, name: 'hasChildren' });

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Section A: Personal Information</h2>
            </div>

            {/* Age Group */}
            <div>
                <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-2">
                    Age Group: <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="ageGroup"
                    {...register('ageGroup')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    placeholder="e.g., 25-34, 35-44"
                    aria-required="true"
                    aria-invalid={errors.ageGroup ? 'true' : 'false'}
                />
                {errors.ageGroup && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.ageGroup.message}</p>
                )}
            </div>

            {/* Gender */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        Gender: <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex gap-6">
                        {['Male', 'Female'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('gender')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.gender && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.gender.message}</p>
                    )}
                </fieldset>
            </div>

            {/* Service Attendance */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        Which service(s) do you attend? (Select all that apply) <span className="text-red-500">*</span>
                    </legend>
                    <div className="space-y-3">
                        {[
                            '1st Service (6:00-8:00am)',
                            '2nd Service (8:00-10:00am)',
                            '3rd Service (10:00am-12:00noon)'
                        ].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    value={option}
                                    {...register('serviceAttendance')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.serviceAttendance && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.serviceAttendance.message}</p>
                    )}
                </fieldset>
            </div>

            {/* Member Status */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        Are you a member of this church? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex gap-6">
                        {['Yes', 'No'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('isMember')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.isMember && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.isMember.message}</p>
                    )}
                </fieldset>
            </div>

            {/* Conditional: Membership Code */}
            {isMember === 'Yes' && (
                <div className="pl-6 border-l-2 border-blue-200 animate-fadeIn">
                    <label htmlFor="membershipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        If &quot;yes&quot;, state your membership code:
                    </label>
                    <input
                        type="text"
                        id="membershipCode"
                        {...register('membershipCode')}
                        className="w-full max-w-xs px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                        placeholder="e.g., M12345"
                    />
                </div>
            )}

            {/* Conditional: Regular Visitor */}
            {isMember === 'No' && (
                <div className="pl-6 border-l-2 border-blue-200 animate-fadeIn">
                    <fieldset>
                        <legend className="block text-sm font-medium text-gray-700 mb-2">
                            If &quot;no&quot;, are you a regular visitor (i.e., at least 2 times a month)?
                        </legend>
                        <div className="flex gap-6">
                            {['Yes', 'No'].map((option) => (
                                <label key={option} className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        value={option}
                                        {...register('isRegularVisitor')}
                                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        aria-label={option}
                                    />
                                    <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </div>
            )}

            {/* Has Children */}
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        Do you have children? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex gap-6">
                        {['Yes', 'No'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register('hasChildren')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    aria-label={option}
                                />
                                <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.hasChildren && (
                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.hasChildren.message}</p>
                    )}
                </fieldset>
            </div>

            {/* Conditional: Children Departments */}
            {hasChildren === 'Yes' && (
                <div className="pl-6 border-l-2 border-blue-200 animate-fadeIn">
                    <fieldset>
                        <legend className="block text-sm font-medium text-gray-700 mb-2">
                            If yes, are they part of any of our departments?
                        </legend>
                        <div className="space-y-3">
                            {['Children Ministry', 'New Generation', 'Salt City'].map((option) => (
                                <label key={option} className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        {...register('childrenDepartments')}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        aria-label={option}
                                    />
                                    <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </div>
            )}
        </div>
    );
};

export default SectionA;
