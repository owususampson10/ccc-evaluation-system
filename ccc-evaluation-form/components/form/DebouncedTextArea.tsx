"use client";

import { useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface DebouncedTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  registration: UseFormRegisterReturn;
  delay?: number;
}

export const DebouncedTextArea = ({
  registration,
  delay = 300,
  ...props
}: DebouncedTextAreaProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const { name, onChange } = registration;
    const value = e.target.value;

    // Debounce the update to React Hook Form, but let the textarea remain uncontrolled
    timerRef.current = setTimeout(() => {
      onChange({
        target: {
          name,
          value,
        },
      } as any);
    }, delay);
  };

  return <textarea {...registration} {...props} onChange={handleChange} />;
};
