"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

const LoginPopup = ({ isOpen, onClose, prompt }) => {
    const dialogRef = useRef(null);
    const router = useRouter();

    // Open dialog when isOpen changes to true
    if (isOpen && dialogRef.current) {
        dialogRef.current.showModal();
    }

    return (
        <dialog ref={dialogRef} className="p-6 rounded-lg shadow-lg w-96 backdrop:bg-black/50">
            <h2 className="text-xl font-semibold">Login Required</h2>
            <p className="mt-2 text-gray-600">You need to log in to perform this action.</p>
            <div className="mt-4 flex justify-end gap-2">
                <button
                    onClick={() => {
                        console.log("Prompt in popup:", prompt);
                        localStorage.setItem("searchPrompt", prompt)
                        router.push("/login")
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Go to Login
                </button>
                <button
                    onClick={() => {
                        dialogRef.current.close();
                        onClose();
                    }}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md"
                >
                    Cancel
                </button>
            </div>
        </dialog>
    );
};

export default LoginPopup;
