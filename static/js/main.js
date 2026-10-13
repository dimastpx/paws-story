document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('timelineViewport');
  if (!viewport) return;

  viewport.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      viewport.scrollLeft += e.deltaY * 1.5;
    }
  }, { passive: false });

  let isDown = false;
  let startX;
  let scrollLeft;

  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.event-card')) return;
    isDown = true;
    startX = e.pageX - viewport.offsetLeft;
    scrollLeft = viewport.scrollLeft;
  });

  viewport.addEventListener('mouseleave', () => {
    isDown = false;
  });

  viewport.addEventListener('mouseup', () => {
    isDown = false;
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.6;
    viewport.scrollLeft = scrollLeft - walk;
  });
});
