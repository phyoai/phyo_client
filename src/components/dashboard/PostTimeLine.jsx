'use client'
import React, { memo } from 'react';
import PostTimelineSection from '../PostTimelineSection';

const PostTimeLine = memo(({
  backgroundColor = 'bg-[#F5F3EE]',
  ...props
}) => {
  return (
    <div className={backgroundColor}>
      <PostTimelineSection {...props} />
    </div>
  );
});

PostTimeLine.displayName = 'PostTimeLine';

export default PostTimeLine;
