'use client';

import React from 'react';

/**
 * ColorPalette Component - Display all design system colors
 * For documentation and testing purposes
 */

const ColorPalette = () => {
  const colors = [
    {
      name: 'Brand Base',
      value: '#43573B',
      cssVar: '--color-brand-base'
    },
    {
      name: 'Accent Base',
      value: '#D9E3CC',
      cssVar: '--color-accent-base'
    },
    {
      name: 'Red',
      value: '#DC2626',
      cssVar: '--color-red-base'
    },
    {
      name: 'Green',
      value: '#16A34A',
      cssVar: '--color-green-base'
    },
    {
      name: 'Yellow',
      value: '#EAB308',
      cssVar: '--color-yellow-base'
    },
    {
      name: 'Blue',
      value: '#2563EB',
      cssVar: '--color-blue-base'
    },
    {
      name: 'Purple',
      value: '#7C3AED',
      cssVar: '--color-purple-base'
    },
    {
      name: 'Neutral Base',
      value: '#F0F0F0',
      cssVar: '--color-neutral-base'
    },
    {
      name: 'Text Base',
      value: '#242527',
      cssVar: '--color-text-base'
    },
    {
      name: 'Text Muted',
      value: '#999999',
      cssVar: '--color-text-muted'
    }
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8 text-text-base">
        Color Palette
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {colors.map((color, index) => (
          <div key={index} className="text-center">
            <div
              className="w-full h-32 rounded-lg shadow-md mb-3 border-2 border-neutral-muted"
              style={{ backgroundColor: color.value }}
            />
            <p className="font-semibold text-text-base text-sm">
              {color.name}
            </p>
            <p className="text-xs text-text-muted font-mono">
              {color.value}
            </p>
            <p className="text-xs text-text-muted font-mono">
              {color.cssVar}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
