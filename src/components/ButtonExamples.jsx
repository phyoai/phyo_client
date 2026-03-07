'use client';

import React from 'react';
import Button from './Button';
import IconButton from './IconButton';
import { ArrowLeftLine, PlusLine, DeleteBinLine, SearchLine } from '@phyoofficial/phyo-icon-library';

/**
 * Button Component Examples & Documentation
 *
 * Comprehensive usage guide for the Ember Design System Button components
 */

export function ButtonVariantsDemo() {
  return (
    <div className="space-y-8 p-8">
      {/* Primary Buttons */}
      <div>
        <h3 className="text-lg font-bold mb-4">Primary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" size="md" disabled>Disabled</Button>
          <Button variant="primary" size="md" loading>Loading</Button>
        </div>
      </div>

      {/* Secondary Buttons */}
      <div>
        <h3 className="text-lg font-bold mb-4">Secondary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" size="sm">Small</Button>
          <Button variant="secondary" size="md">Medium</Button>
          <Button variant="secondary" size="lg">Large</Button>
          <Button variant="secondary" size="md" disabled>Disabled</Button>
        </div>
      </div>

      {/* Tertiary Buttons */}
      <div>
        <h3 className="text-lg font-bold mb-4">Tertiary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="tertiary" size="sm">Small</Button>
          <Button variant="tertiary" size="md">Medium</Button>
          <Button variant="tertiary" size="lg">Large</Button>
          <Button variant="tertiary" size="md" disabled>Disabled</Button>
        </div>
      </div>

      {/* Outlined Buttons */}
      <div>
        <h3 className="text-lg font-bold mb-4">Outlined Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outlined" size="sm">Small</Button>
          <Button variant="outlined" size="md">Medium</Button>
          <Button variant="outlined" size="lg">Large</Button>
          <Button variant="outlined" size="md" disabled>Disabled</Button>
        </div>
      </div>

      {/* Buttons with Icons */}
      <div>
        <h3 className="text-lg font-bold mb-4">Buttons with Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="md" icon={ArrowLeftLine} iconPosition="left">
            Back
          </Button>
          <Button variant="primary" size="md" icon={PlusLine} iconPosition="left">
            Create
          </Button>
          <Button variant="secondary" size="md" icon={SearchLine} iconPosition="right">
            Search
          </Button>
          <Button variant="tertiary" size="md" icon={DeleteBinLine} iconPosition="left">
            Delete
          </Button>
        </div>
      </div>

      {/* Full Width */}
      <div>
        <h3 className="text-lg font-bold mb-4">Full Width Button</h3>
        <Button variant="primary" size="lg" fullWidth>
          Submit Form
        </Button>
      </div>

      {/* Icon Buttons */}
      <div>
        <h3 className="text-lg font-bold mb-4">Icon Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Default - Small</p>
            <IconButton icon={ArrowLeftLine} size="sm" variant="default" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Default - Medium</p>
            <IconButton icon={ArrowLeftLine} size="md" variant="default" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Default - Large</p>
            <IconButton icon={ArrowLeftLine} size="lg" variant="default" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Filled - Medium</p>
            <IconButton icon={PlusLine} size="md" variant="filled" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Outlined - Medium</p>
            <IconButton icon={DeleteBinLine} size="md" variant="outlined" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Disabled</p>
            <IconButton icon={ArrowLeftLine} size="md" variant="default" disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Usage Guide
 *
 * === BUTTON COMPONENT ===
 *
 * Basic Usage:
 * <Button variant="primary" size="md">Click me</Button>
 *
 * Props:
 * - variant: 'primary' | 'secondary' | 'tertiary' | 'outlined'
 * - size: 'sm' | 'md' | 'lg'
 * - disabled: boolean
 * - loading: boolean
 * - fullWidth: boolean
 * - icon: React component (from @phyoofficial/phyo-icon-library)
 * - iconPosition: 'left' | 'right'
 * - onClick: function
 *
 * Examples:
 *
 * 1. Primary Action Button:
 *    <Button variant="primary" size="lg" fullWidth onClick={handleSubmit}>
 *      Submit Campaign
 *    </Button>
 *
 * 2. Secondary Action Button:
 *    <Button variant="secondary" size="md">
 *      Cancel
 *    </Button>
 *
 * 3. Danger Button (Tertiary):
 *    <Button variant="tertiary" size="md" icon={DeleteBinLine}>
 *      Delete Account
 *    </Button>
 *
 * 4. Loading State:
 *    <Button variant="primary" loading={isSubmitting}>
 *      {isSubmitting ? '' : 'Submit'}
 *    </Button>
 *
 * === ICON BUTTON COMPONENT ===
 *
 * Basic Usage:
 * <IconButton icon={ArrowLeftLine} size="md" variant="default" onClick={() => router.back()} />
 *
 * Props:
 * - icon: React component (required)
 * - size: 'sm' | 'md' | 'lg'
 * - variant: 'default' | 'filled' | 'outlined'
 * - disabled: boolean
 * - onClick: function
 *
 * Examples:
 *
 * 1. Back Navigation:
 *    <IconButton
 *      icon={ArrowLeftLine}
 *      size="md"
 *      onClick={() => router.back()}
 *    />
 *
 * 2. FAB (Floating Action Button):
 *    <IconButton
 *      icon={PlusLine}
 *      size="lg"
 *      variant="filled"
 *      onClick={handleCreate}
 *    />
 *
 * 3. Menu Button:
 *    <IconButton
 *      icon={MoreLine}
 *      size="md"
 *      variant="default"
 *      onClick={() => setShowMenu(!showMenu)}
 *    />
 */
