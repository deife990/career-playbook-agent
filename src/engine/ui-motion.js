'use strict';
// CSS tokens are the single source for both CSS and Web Animations durations.
const CP_MOTION={duration(name){return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cp-motion-'+name))||0},ease(){return getComputedStyle(document.documentElement).getPropertyValue('--cp-ease-out').trim()}};
