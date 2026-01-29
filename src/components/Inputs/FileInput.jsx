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
        <div className="flex flex-col gap-2">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-[#242527]">
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
                <div className={`flex flex-col items-center justify-center bg-[#f0f0f0] rounded-xl p-8 cursor-pointer transition min-h-[136px] ${
                    hasError 
                        ? 'border-2 border-red-500' 
                        : 'hover:bg-[#e6e6e6]'
                }`}>
                    {fileName ? (
                        <>
                            <CircleCheck className="mb-2 text-[#43573b] w-6 h-6" />
                            <span className="text-sm text-gray-700 text-center">
                                {fileName}
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="text-base text-gray-800 mb-2">
                                Drag files here to upload..
                            </span>
                            <button type="button" className="mt-2 px-4 py-2 text-sm font-medium text-[#43573b] border border-[#43573b] rounded-full hover:bg-[#43573b] hover:text-white transition-colors">
                                Browse Files
                            </button>
                        </>
                    )}
                </div>
            </label>

            {hasError && (
                <p className="mt-1 text-sm text-red-500">{hasError.message}</p>
            )}
        </div>
    );
};

export default FileInput;