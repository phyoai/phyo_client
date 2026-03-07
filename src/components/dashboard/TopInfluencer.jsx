'use client'
import React, { memo } from 'react';
import TopInfluencersSection from '../TopInfluencersSection';

const TopInfluencer = memo(({
  backgroundColor = 'bg-[#F5F3EE]',
  ...props
}) => {
  return (
    <div className={backgroundColor}>
      <TopInfluencersSection {...props} />
    </div>
  );
});

TopInfluencer.displayName = 'TopInfluencer';

export default TopInfluencer;
