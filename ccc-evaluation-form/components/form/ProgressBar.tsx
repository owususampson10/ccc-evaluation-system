interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    labels: string[];
    onStepClick?: (step: number) => void;
}

const ProgressBar = ({ currentStep, totalSteps, labels, onStepClick }: ProgressBarProps) => {
    return (
        <div className="w-full mb-8">
            <div className="flex justify-between items-center">
                {labels.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div
                            key={label}
                            className={`flex flex-col items-center flex-1 ${onStepClick ? 'cursor-pointer' : ''}`}
                            onClick={() => onStepClick && onStepClick(stepNumber)}
                        >
                            {/* Step indicator */}
                            <div className="relative flex items-center justify-center w-full">
                                {/* Line before */}
                                {index > 0 && (
                                    <div
                                        className={`absolute left-0 right-1/2 h-1 -z-10 ${isCompleted || isCurrent ? 'bg-blue-500' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                                {/* Line after */}
                                {index < totalSteps - 1 && (
                                    <div
                                        className={`absolute left-1/2 right-0 h-1 -z-10 ${isCompleted ? 'bg-blue-500' : 'bg-gray-200'
                                            }`}
                                    />
                                )}

                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isCompleted
                                        ? 'bg-blue-500 text-white'
                                        : isCurrent
                                            ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                    role="progressbar"
                                    aria-valuenow={currentStep}
                                    aria-valuemin={1}
                                    aria-valuemax={totalSteps}
                                    aria-label={`Step ${stepNumber}: ${label}`}
                                >
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        label
                                    )}
                                </div>
                            </div>

                            {/* Label */}
                            <span
                                className={`mt-2 text-xs font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-blue-500' : 'text-gray-400'
                                    }`}
                            >
                                Section {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;
