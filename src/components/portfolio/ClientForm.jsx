'use client';

import React, { useState, useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

/**
 * Client Form Component (TIER 4)
 * Form for adding/editing clients in portfolio
 * Fields: client name, project title, services, duration, status, budget
 */
const ClientForm = ({ portfolioId, clientId, onSuccess, onCancel }) => {
  const {
    loading,
    error,
    addClient,
    updateClient,
  } = usePortfolio();

  const [formData, setFormData] = useState({
    clientName: '',
    projectTitle: '',
    servicesProvided: [],
    projectDuration: '',
    projectStatus: 'Completed',
    budget: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [formError, setFormError] = useState('');
  const services = ['Design', 'Development', 'Strategy', 'Content', 'Marketing', 'Branding'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) : value,
    }));
  };

  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      servicesProvided: prev.servicesProvided.includes(service)
        ? prev.servicesProvided.filter(s => s !== service)
        : [...prev.servicesProvided, service],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.clientName.trim() || !formData.projectTitle.trim()) {
      setFormError('Client name and project title are required');
      return;
    }

    try {
      if (clientId) {
        await updateClient(portfolioId, clientId, formData);
      } else {
        await addClient(portfolioId, formData);
      }
      onSuccess && onSuccess();
    } catch (err) {
      setFormError(err.message || 'Failed to save client');
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">
        {clientId ? 'Edit Client' : 'Add New Client'}
      </h2>

      {(formError || error) && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Client name"
              className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
            />
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Project Title</label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              placeholder="Project title"
              className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="projectStatus"
              value={formData.projectStatus}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
            >
              <option>Completed</option>
              <option>In Progress</option>
              <option>On Hold</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium mb-2">Budget</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Project budget"
              className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
            />
          </div>
        </div>

        {/* Services */}
        <div>
          <label className="block text-sm font-medium mb-3">Services Provided</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {services.map(service => (
              <label key={service} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.servicesProvided.includes(service)}
                  onChange={() => toggleService(service)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{service}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Project Description</label>
          <textarea
            name="projectDescription"
            value={formData.projectDescription || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
            placeholder="Describe the project"
            rows={3}
            className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Saving...' : clientId ? 'Update Client' : 'Add Client'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default ClientForm;
