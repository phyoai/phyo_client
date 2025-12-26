import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { CloudUpload, CircleCheck } from 'lucide-react';

const FileInput = ({ name, label, required = false, className = '', accept = '', multiple = false }) => {
    const {
        register,
        formState: { errors },
        setValue,
        watch,
    } = useFormContext();

    const file = watch(name);
    const [fileName, setFileName] = useState('');

    // Helper function to get nested error
    const getNestedError = (errors, path) => {
        const keys = path.split('.');
        let error = errors;
        for (const key of keys) {
            if (error && error[key]) {
                error = error[key];
            } else {
                return null;
            }
        }
        return error;
    };

    const hasError = getNestedError(errors, name);

    // Update fileName when file value changes from form state
    useEffect(() => {
        if (file) {
            if (file instanceof File) {
                setFileName(file.name);
            } else if (file instanceof FileList) {
                setFileName(file.length > 1 ? `${file.length} files selected` : file[0]?.name || '');
            } else if (Array.isArray(file)) {
                setFileName(file.length > 1 ? `${file.length} files selected` : file[0]?.name || '');
            }
        } else {
            setFileName('');
        }
    }, [file]);

    const handleChange = (e) => {
        const selectedFiles = e.target.files;
        if (multiple) {
            setValue(name, selectedFiles, { shouldValidate: true });
            setFileName(selectedFiles.length > 1 ? `${selectedFiles.length} files selected` : selectedFiles[0]?.name || '');
        } else {
            const selectedFile = selectedFiles[0];
            setValue(name, selectedFile, { shouldValidate: true });
            setFileName(selectedFile?.name || '');
        }
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
                accept={accept}
                multiple={multiple}
            />

            <label htmlFor={name}>
                <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer transition focus:outline-none focus:ring-2 ${
                    hasError 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 hover:border-green-500 focus:ring-green-500'
                }`}>
                    {fileName ? <CircleCheck className="mb-1 text-green-600" /> : <CloudUpload className="mb-1 text-gray-400" />}
                    <span className="text-sm text-gray-600">
                        {fileName || 'Click to upload'}
                    </span>
                </div>
            </label>

            {hasError && (
                <p className="mt-1 text-sm text-red-500">{hasError.message}</p>
            )}
        </div>
    );
};

export default FileInput;