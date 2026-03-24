import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';

const RadioInput = ({ name, label, options = [], required = false }) => {
    const {
        register,
        formState: { errors },
        watch,
    } = useFormContext();

    const selectedValue = watch(name);

    return (
        <div className="mb-4">
            {label && (
                <p className="block text-sm font-medium mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </p>
            )}

            <div className="space-y-2">
                {options.map((option, index) => (
                    <label
                        key={index}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition `}
                    >
                        <input
                            type="radio"
                            value={option.value}
                            {...register(name, {
                                required: required ? `${label || name} is required` : false,
                            })}
                            className="hidden"
                        />
                        <span className="flex items-center gap-2">
                            <div className="w-5 h-5">
                                {selectedValue === option.value ? (
                                    <div className="w-5 h-5 border border-[#12B28C] rounded-full flex items-center justify-center" >
                                        <span className='bg-[#12B28C] w-3 h-3 rounded-full'></span>
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 border border-gray-300 rounded-full" />
                                )}
                            </div>
                            <span className={`text-sm ${selectedValue === option.value ? "font-medium" : "" }`}>{option.label}</span>
                        </span>
                    </label>
                ))}
            </div>

            {errors[name] && (
                <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
            )}
        </div>
    );
};

export default RadioInput;
