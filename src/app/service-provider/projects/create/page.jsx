'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/projects/ProjectForm';

/**
 * Create Project Page
 * Wraps ProjectForm for new project creation
 */
const CreateProjectPage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/service-provider/projects');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Project</h1>
        <p className="text-neutral-text mt-2">Create a new project to get started</p>
      </div>
      <ProjectForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
};

export default CreateProjectPage;
