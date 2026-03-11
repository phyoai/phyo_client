'use client';

import React, { useState } from 'react';
import Badge from './Badge';
import Banner from './Banner';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import Chip from './Chip';
import Avatar from './Avatar';
import TextField from './TextField';
import ListItem from './ListItem';
import Breadcrumbs from './Breadcrumbs';
import DatePicker from './DatePicker';
import Carousel from './Carousel';
import AppBar from './AppBar';
import { AccountCircleFill, BellLine } from '@phyoofficial/phyo-icon-library';

/**
 * Component Showcase - Demonstrates all UI components from Phyo Design System
 */

export default function ComponentShowcase() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [checkboxState, setCheckboxState] = useState(false);

  const carouselItems = [
    'https://via.placeholder.com/800x400/43573B/ffffff?text=Slide+1',
    'https://via.placeholder.com/800x400/7DB06E/ffffff?text=Slide+2',
    'https://via.placeholder.com/800x400/D9E3CC/000000?text=Slide+3',
  ];

  const breadcrumbItems = [
    { label: 'Home', onClick: () => console.log('Home') },
    { label: 'Components', onClick: () => console.log('Components') },
    { label: 'Showcase' },
  ];

  return (
    <div className="bg-neutral-base min-h-screen">
      {/* App Bar */}
      <AppBar
        title="Component Showcase"
        subtitle="Phyo Design System"
        actions={[
          { icon: BellLine, label: 'Notifications', badge: true, onClick: () => {} }
        ]}
      />

      <div className="p-8 max-w-6xl mx-auto space-y-12">
        {/* Breadcrumbs */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Breadcrumbs</h2>
          <Breadcrumbs items={breadcrumbItems} />
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="red" size="lg">Red</Badge>
            <Badge variant="green" size="lg">Green</Badge>
            <Badge variant="yellow" size="lg">Yellow</Badge>
            <Badge variant="blue" size="lg">Blue</Badge>
            <Badge variant="purple" size="lg">Purple</Badge>
          </div>
        </section>

        {/* Banners */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Banners</h2>
          <div className="space-y-3">
            <Banner variant="info" title="Info" dismissible>
              This is an informational banner message
            </Banner>
            <Banner variant="success" title="Success" dismissible>
              Operation completed successfully
            </Banner>
            <Banner variant="warning" title="Warning" dismissible>
              Please review this important warning
            </Banner>
            <Banner variant="error" title="Error" dismissible>
              An error occurred during processing
            </Banner>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Buttons</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="outlined">Outlined</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
            </div>
          </div>
        </section>

        {/* Checkboxes */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Checkboxes</h2>
          <div className="space-y-3">
            <Checkbox
              label="Small checkbox"
              size="sm"
              checked={checkboxState}
              onChange={(e) => setCheckboxState(e.target.checked)}
            />
            <Checkbox
              label="Medium checkbox"
              size="md"
              checked={checkboxState}
              onChange={(e) => setCheckboxState(e.target.checked)}
            />
            <Checkbox
              label="Large checkbox"
              size="lg"
              checked={checkboxState}
              onChange={(e) => setCheckboxState(e.target.checked)}
            />
            <Checkbox label="Disabled" disabled />
          </div>
        </section>

        {/* Chips */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Chips</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-muted">Input Chips:</p>
              <Chip.Group variant="input">
                <Chip variant="input" onRemove={() => {}}>Chip 1</Chip>
                <Chip variant="input" selected onRemove={() => {}}>Chip 2</Chip>
                <Chip variant="input" onRemove={() => {}}>Chip 3</Chip>
              </Chip.Group>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-muted">Filter Chips:</p>
              <Chip.Group variant="filter">
                <Chip variant="filter" onClick={() => {}}>Filter 1</Chip>
                <Chip variant="filter" selected onClick={() => {}}>Filter 2</Chip>
                <Chip variant="filter" onClick={() => {}}>Filter 3</Chip>
              </Chip.Group>
            </div>
          </div>
        </section>

        {/* Avatars */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Avatars</h2>
          <div className="flex gap-4 flex-wrap">
            <Avatar variant="initials" initials="JD" size="sm" />
            <Avatar variant="initials" initials="AB" size="md" />
            <Avatar variant="initials" initials="XY" size="lg" bgColor="bg-green-base" />
            <Avatar variant="initials" initials="CD" size="xl" bgColor="bg-blue-base" />
          </div>
        </section>

        {/* Text Fields */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Text Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <TextField label="Default" placeholder="Enter text..." />
            <TextField label="Success" success placeholder="Valid input" />
            <TextField label="Error" error errorMessage="This field is required" />
            <TextField label="Disabled" disabled placeholder="Disabled field" />
          </div>
        </section>

        {/* Date Picker */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Date Picker</h2>
          <div className="max-w-sm">
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
          </div>
        </section>

        {/* Lists */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">List Items</h2>
          <ListItem.Group>
            <ListItem
              title="Item 1"
              description="Description for item 1"
              avatar={<Avatar variant="initials" initials="A1" size="md" />}
              clickable
            />
            <ListItem
              title="Item 2"
              description="Description for item 2"
              avatar={<Avatar variant="initials" initials="A2" size="md" bgColor="bg-green-base" />}
              clickable
            />
            <ListItem
              title="Item 3"
              description="Description for item 3"
              avatar={<Avatar variant="initials" initials="A3" size="md" bgColor="bg-blue-base" />}
              action={<Badge variant="success">New</Badge>}
            />
          </ListItem.Group>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default">
              <Card.Title>Default Card</Card.Title>
              <Card.Description>
                This is a default card with border and shadow
              </Card.Description>
              <Card.Footer>
                <Button variant="tertiary" size="sm">Cancel</Button>
                <Button size="sm">Action</Button>
              </Card.Footer>
            </Card>

            <Card variant="elevated">
              <Card.Title>Elevated Card</Card.Title>
              <Card.Description>
                This is an elevated card with higher shadow
              </Card.Description>
              <Card.Footer>
                <Button size="sm">Learn More</Button>
              </Card.Footer>
            </Card>

            <Card variant="outlined">
              <Card.Title>Outlined Card</Card.Title>
              <Card.Description>
                This is an outlined card with brand color border
              </Card.Description>
              <Card.Meta label="Metric" value="1.2K" />
            </Card>
          </div>
        </section>

        {/* Carousel */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-text-base">Carousel</h2>
          <div className="max-w-2xl">
            <Carousel
              items={carouselItems}
              autoPlay
              autoPlayDelay={4000}
              showControls
              showIndicators
              itemClassName="h-64"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
