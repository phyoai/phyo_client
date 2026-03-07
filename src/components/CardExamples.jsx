'use client';

import React from 'react';
import Card from './Card';
import Button from './Button';
import { HeartLine, ShareLine, MessageLine, UserLine } from '@phyoofficial/phyo-icon-library';

/**
 * Card Component Examples & Documentation
 *
 * Comprehensive usage guide for the Ember Design System Card component
 */

export function CardVariantsDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {/* Basic Card */}
      <Card variant="default">
        <Card.Title>Campaign Title</Card.Title>
        <Card.Description>
          This is a simple card with a title and description. Perfect for showcasing basic information.
        </Card.Description>
        <Card.Footer>
          <Button variant="secondary" size="sm">Learn More</Button>
        </Card.Footer>
      </Card>

      {/* Card with Image */}
      <Card variant="default">
        <Card.Header image="https://via.placeholder.com/300x200" imageAlt="Campaign" />
        <Card.Title>Influencer Campaign</Card.Title>
        <Card.Badge variant="success" size="sm">Active</Card.Badge>
        <Card.Description>
          Connect with top influencers for your brand campaign.
        </Card.Description>
        <Card.Footer>
          <Button variant="primary" size="sm">View Details</Button>
        </Card.Footer>
      </Card>

      {/* Card with Metadata */}
      <Card variant="default">
        <Card.Title>Premium Campaign</Card.Title>
        <Card.Meta label="Budget" value="₹50,000" icon={UserLine} />
        <Card.Meta label="Influencers" value="25" />
        <Card.Meta label="Duration" value="30 days" />
        <Card.Description>
          Premium tier campaign with extended reach.
        </Card.Description>
        <Card.Footer>
          <Button variant="secondary" size="sm">Details</Button>
          <Button variant="primary" size="sm">Select</Button>
        </Card.Footer>
      </Card>

      {/* Influencer Card */}
      <Card variant="elevated">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: '#43573B' }}
          >
            JA
          </div>
          <div>
            <Card.Title size="sm">Jessica Anderson</Card.Title>
            <p style={{ color: '#999999' }} className="text-xs">
              @jessica_anderson
            </p>
          </div>
        </div>
        <Card.Meta label="Followers" value="125.4K" />
        <Card.Meta label="Engagement" value="4.2%" />
        <Card.Description>
          Lifestyle & Fashion influencer with authentic content.
        </Card.Description>
        <Card.Footer>
          <Button variant="secondary" size="sm">Profile</Button>
          <Button variant="primary" size="sm">Follow</Button>
        </Card.Footer>
      </Card>

      {/* Product Card */}
      <Card variant="default">
        <Card.Header image="https://via.placeholder.com/300x200" imageAlt="Product" />
        <Card.Title>Premium Product</Card.Title>
        <Card.Badge variant="danger" size="sm">Limited Stock</Card.Badge>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold" style={{ color: '#43573B' }}>
            ₹2,499
          </span>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-neutral-muted rounded-full transition">
              <HeartLine width={18} height={18} />
            </button>
            <button className="p-2 hover:bg-neutral-muted rounded-full transition">
              <ShareLine width={18} height={18} />
            </button>
          </div>
        </div>
        <Card.Footer>
          <Button variant="secondary" size="sm" fullWidth>
            Add to Cart
          </Button>
        </Card.Footer>
      </Card>

      {/* Outlined Card */}
      <Card variant="outlined">
        <Card.Title size="md">Recommended</Card.Title>
        <Card.Description>
          This card has an outlined style with a brand-colored border.
        </Card.Description>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-base" />
            <span className="text-sm">Feature 1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-base" />
            <span className="text-sm">Feature 2</span>
          </div>
        </div>
        <Card.Footer>
          <Button variant="primary" size="sm" fullWidth>
            Get Started
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

/**
 * Usage Guide
 *
 * === CARD COMPONENT ===
 *
 * Basic Usage:
 * <Card variant="default">
 *   <Card.Title>Title</Card.Title>
 *   <Card.Description>Description text</Card.Description>
 *   <Card.Footer>
 *     <Button>Action</Button>
 *   </Card.Footer>
 * </Card>
 *
 * Props:
 * - variant: 'default' | 'elevated' | 'outlined'
 * - padding: Tailwind padding classes (default: 'p-6')
 * - className: Additional CSS classes
 *
 * Sub-components:
 *
 * === Card.Header ===
 * Display image or placeholder at top of card
 * Props:
 * - image: URL string for image
 * - imageAlt: Alt text for image
 * - height: Tailwind height class (default: 'h-48')
 * - children: For custom content when no image
 *
 * Example:
 * <Card>
 *   <Card.Header image="/campaign.jpg" />
 *   <Card.Title>Campaign</Card.Title>
 * </Card>
 *
 * === Card.Title ===
 * Main heading with semantic HTML
 * Props:
 * - level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' (default: 'h3')
 * - size: 'sm' | 'md' | 'lg'
 * - className: Additional CSS
 *
 * === Card.Description ===
 * Secondary text/body content
 * Props: className
 *
 * === Card.Badge ===
 * Status indicator or tag
 * Props:
 * - variant: 'default' | 'success' | 'danger' | 'warning' | 'info'
 * - size: 'sm' | 'md'
 * - className: Additional CSS
 *
 * Example:
 * <Card.Badge variant="success">Active</Card.Badge>
 *
 * === Card.Meta ===
 * Display key-value metadata
 * Props:
 * - label: Left side text
 * - value: Right side value
 * - icon: Icon component from phyo-icon-library
 * - className: Additional CSS
 *
 * Example:
 * <Card.Meta label="Budget" value="₹50,000" icon={DollarIcon} />
 *
 * === Card.Footer ===
 * Bottom section for actions/buttons
 * Props: className
 *
 * === COMPLETE EXAMPLE ===
 *
 * Influencer Card:
 * <Card variant="elevated">
 *   <Card.Header image="/influencer.jpg" />
 *   <Card.Title>Jessica Anderson</Card.Title>
 *   <Card.Badge variant="success">Verified</Card.Badge>
 *   <Card.Meta label="Followers" value="125K" icon={UserLine} />
 *   <Card.Meta label="Engagement" value="4.2%" />
 *   <Card.Description>
 *     Lifestyle & Fashion influencer
 *   </Card.Description>
 *   <Card.Footer>
 *     <Button variant="secondary" size="sm">Profile</Button>
 *     <Button variant="primary" size="sm">Follow</Button>
 *   </Card.Footer>
 * </Card>
 *
 * Campaign Card:
 * <Card variant="default">
 *   <Card.Header image="/campaign.jpg" />
 *   <Card.Title>Summer Campaign 2024</Card.Title>
 *   <Card.Badge variant="info" size="sm">Active</Card.Badge>
 *   <Card.Meta label="Budget" value="₹100,000" />
 *   <Card.Meta label="Influencers" value="50" />
 *   <Card.Meta label="Reach" value="10M+" />
 *   <Card.Description>
 *     Join our summer collaboration campaign
 *   </Card.Description>
 *   <Card.Footer>
 *     <Button variant="secondary" size="sm">Details</Button>
 *     <Button variant="primary" size="lg" fullWidth>
 *       Apply Now
 *     </Button>
 *   </Card.Footer>
 * </Card>
 */
