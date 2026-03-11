'use client';

import React from 'react';
import Heading from './Typography/Heading';
import Body from './Typography/Body';
import Label from './Typography/Label';
import Caption from './Typography/Caption';
import Container from './Layout/Container';
import Stack from './Layout/Stack';

/**
 * DesignTokensReference - Complete documentation of design system tokens
 */

export default function DesignTokensReference() {
  return (
    <Container size="4xl" className="py-16">
      {/* Typography */}
      <section className="mb-16">
        <Heading level="h2" className="mb-6">Typography</Heading>

        <div className="space-y-6">
          <div>
            <Heading level="h1">Heading 1 - 36px/48px</Heading>
            <Caption>font-bold, leading-tight</Caption>
          </div>

          <div>
            <Heading level="h2">Heading 2 - 30px/36px</Heading>
            <Caption>font-bold, leading-tight</Caption>
          </div>

          <div>
            <Heading level="h3">Heading 3 - 24px/30px</Heading>
            <Caption>font-bold, leading-tight</Caption>
          </div>

          <div>
            <Heading level="h4">Heading 4 - 20px/24px</Heading>
            <Caption>font-semibold, leading-snug</Caption>
          </div>

          <div>
            <Body size="lg" weight="semibold">Body Large - 18px</Body>
            <Caption>font-semibold, leading-relaxed</Caption>
          </div>

          <div>
            <Body size="md" weight="normal">Body Medium - 16px</Body>
            <Caption>font-normal, leading-relaxed</Caption>
          </div>

          <div>
            <Body size="sm">Body Small - 14px</Body>
            <Caption>font-normal, leading-normal</Caption>
          </div>

          <div>
            <Body size="xs">Body Extra Small - 12px</Body>
            <Caption>font-normal, leading-normal</Caption>
          </div>

          <div>
            <Label size="lg" htmlFor="ex1">Form Label Large - 16px</Label>
            <Caption>font-semibold</Caption>
          </div>

          <div>
            <Label size="md" htmlFor="ex2">Form Label Medium - 14px</Label>
            <Caption>font-medium</Caption>
          </div>

          <div>
            <Label size="sm" htmlFor="ex3">Form Label Small - 12px</Label>
            <Caption>font-medium, uppercase, tracking-wider</Caption>
          </div>
        </div>
      </section>

      {/* Spacing Scale */}
      <section className="mb-16">
        <Heading level="h2" className="mb-6">Spacing Scale</Heading>

        <div className="space-y-4">
          <Stack direction="horizontal" spacing="md" align="center">
            <div className="w-1 h-12 bg-brand-base rounded" />
            <Body>xs - 4px (0.25rem)</Body>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center">
            <div className="w-2 h-12 bg-brand-base rounded" />
            <Body>sm - 8px (0.5rem)</Body>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center">
            <div className="w-4 h-12 bg-brand-base rounded" />
            <Body>md - 16px (1rem)</Body>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center">
            <div className="w-6 h-12 bg-brand-base rounded" />
            <Body>lg - 24px (1.5rem)</Body>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center">
            <div className="w-8 h-12 bg-brand-base rounded" />
            <Body>xl - 32px (2rem)</Body>
          </Stack>

          <Stack direction="horizontal" spacing="md" align="center">
            <div className="w-10 h-12 bg-brand-base rounded" />
            <Body>2xl - 40px (2.5rem)</Body>
          </Stack>
        </div>
      </section>

      {/* Colors */}
      <section className="mb-16">
        <Heading level="h2" className="mb-6">Color Palette</Heading>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { name: 'Brand Base', bg: 'bg-brand-base' },
            { name: 'Accent Base', bg: 'bg-accent-base' },
            { name: 'Red', bg: 'bg-red-base' },
            { name: 'Green', bg: 'bg-green-base' },
            { name: 'Yellow', bg: 'bg-yellow-base' },
            { name: 'Blue', bg: 'bg-blue-base' },
            { name: 'Purple', bg: 'bg-purple-base' },
            { name: 'Red Light', bg: 'bg-red-light' },
            { name: 'Green Light', bg: 'bg-green-light' },
            { name: 'Neutral Muted', bg: 'bg-neutral-muted' },
          ].map((color, i) => (
            <div key={i} className="text-center">
              <div className={`w-full h-24 ${color.bg} rounded-lg shadow mb-2 border border-neutral-muted`} />
              <Body size="sm" weight="medium">{color.name}</Body>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section className="mb-16">
        <Heading level="h2" className="mb-6">Border Radius</Heading>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Small', class: 'rounded-sm', px: '4px' },
            { name: 'Medium', class: 'rounded-md', px: '8px' },
            { name: 'Large', class: 'rounded-lg', px: '12px' },
            { name: 'Full', class: 'rounded-full', px: '9999px' },
          ].map((radius, i) => (
            <div key={i} className="text-center">
              <div className={`w-24 h-24 ${radius.class} bg-brand-base mx-auto mb-2`} />
              <Body size="sm" weight="medium">{radius.name}</Body>
              <Caption>{radius.px}</Caption>
            </div>
          ))}
        </div>
      </section>

      {/* Shadows/Elevations */}
      <section className="mb-16">
        <Heading level="h2" className="mb-6">Elevations (Shadows)</Heading>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Shadow Small', class: 'shadow-sm' },
            { name: 'Shadow Medium', class: 'shadow-md' },
            { name: 'Shadow Large', class: 'shadow-lg' },
            { name: 'Shadow Extra Large', class: 'shadow-xl' },
          ].map((shadow, i) => (
            <div key={i} className="text-center">
              <div className={`w-24 h-24 bg-white ${shadow.class} mx-auto mb-2 rounded-lg`} />
              <Body size="sm" weight="medium">{shadow.name}</Body>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing Examples */}
      <section>
        <Heading level="h2" className="mb-6">Layout Spacing Examples</Heading>

        <Stack direction="vertical" spacing="lg">
          <div className="p-4 bg-neutral-base rounded-lg border border-neutral-muted">
            <Body size="sm">
              <strong>Small Container:</strong> padding 16px (md)
            </Body>
          </div>

          <div className="p-6 bg-neutral-base rounded-lg border border-neutral-muted">
            <Body size="sm">
              <strong>Medium Container:</strong> padding 24px (lg)
            </Body>
          </div>

          <div className="p-8 bg-neutral-base rounded-lg border border-neutral-muted">
            <Body size="sm">
              <strong>Large Container:</strong> padding 32px (xl)
            </Body>
          </div>
        </Stack>
      </section>
    </Container>
  );
}
