import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CloudUpload, CircleCheck } from 'lucide-react';

const FileInput = ({ name, label, required = false, className = '' }) => {
    const {
        register,
        formState: { errors },
        setValue,
        watch,
    } = useFormContext();

    const file = watch(name);
    const [fileName, setFileName] = useState('');

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        setFileName(selectedFile?.name || '');
        setValue(name, selectedFile, { shouldValidate: true });
    };

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <input
                id={name}
                type="file"
                className="hidden"
                onChange={handleChange}
            />

            <label htmlFor={name}>
                <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer transition ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}>
                    {fileName ? <CircleCheck className="mb-1" /> : <CloudUpload className="mb-1" />}
                    <span className="text-sm text-gray-600">
                        {fileName || 'Click to upload'}
                    </span>
                </div>
            </label>

            {errors[name] && (
                <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
            )}
        </div>
    );
};

export default FileInput;
