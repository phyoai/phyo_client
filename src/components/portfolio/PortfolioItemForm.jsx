'use client';

import React, { useState, useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

/**
 * Portfolio Item Form Component (TIER 4)
 * Form for creating/editing portfolio items
 * Fields: title, description, category, featured toggle
 */
const PortfolioItemForm = ({ itemId, onSuccess, onCancel }) => {
  const {
    selectedItem,
    loading,
    error,
    fetchPortfolioItem,
    createNewPortfolioItem,
    updateExistingPortfolioItem,
  } = usePortfolio();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Design',
    featured: false,
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (itemId) {
      fetchPortfolioItem(itemId);
    }
  }, [itemId]);

  useEffect(() => {
    if (selectedItem && itemId) {
      setFormData({
        title: selectedItem.title || '',
        description: selectedItem.description || '',
        category: selectedItem.category || 'Web Design',
        featured: selectedItem.featured || false,
      });
    }
  }, [selectedItem, itemId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Portfolio title is required');
      return;
    }

    try {
      if (itemId) {
        await updateExistingPortfolioItem(itemId, formData);
      } else {
        await createNewPortfolioItem(formData);
      }
      onSuccess && onSuccess();
    } catch (err) {
      setFormError(err.message || 'Failed to save portfolio item');
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">
        {itemId ? 'Edit Portfolio Item' : 'Create Portfolio Item'}
      </h2>

      {(formError || error) && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Portfolio item title"
            className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your portfolio item"
            rows={4}
            className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
          >
            <option>Web Design</option>
            <option>Branding</option>
            <option>Photography</option>
            <option>Development</option>
            <option>Marketing</option>
            <option>Other</option>
          </select>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Mark as Featured
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Saving...' : itemId ? 'Update Item' : 'Create Item'}
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

export default PortfolioItemForm;
