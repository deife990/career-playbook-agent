'use strict';
// Layout previews use the same title, assets and working menu as the game.
(() => {
  const layout = new URLSearchParams(location.search).get('title-layout');
  document.documentElement.dataset.titleLayout = ['A', 'B', 'C'].includes(layout) ? layout : 'A';
  document.getElementById('title-settings').addEventListener('click', () => document.getElementById('settings').click());
})();
