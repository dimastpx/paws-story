const vp = document.getElementById('viewport');
const tooltip = document.getElementById('rosterTooltip');
let currentTile = null;

// Позиционирование всплывающего окна
function updateTooltip(tile) {
  if (!tile || !tooltip) return;
  const tmpl = tile.querySelector('.roster-template');
  if (!tmpl) return;

  tooltip.innerHTML = tmpl.innerHTML;
  tooltip.style.display = 'block';

  const rect = tile.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();

  // Выравнивание по горизонтали по центру карточки с защитой от вылета за экран
  let left = rect.left + (rect.width - tipRect.width) / 2;
  left = Math.max(16, Math.min(window.innerWidth - tipRect.width - 16, left));

  // Выравнивание по вертикали:
  // Если карточка верхняя (data-placement="top") -> открываем СНИЗУ от карточки,
  // чтобы гарантированно не задевать шапку сайта!
  const placement = tile.dataset.placement;
  let top;

  if (placement === 'top') {
    top = rect.bottom + 12;
  } else {
    top = rect.top - tipRect.height - 12;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.opacity = '1';
}

function hideTooltip() {
  if (!tooltip) return;
  tooltip.style.opacity = '0';
  tooltip.style.display = 'none';
  currentTile = null;
}

// Навешивание событий на все плитки
document.querySelectorAll('.tile').forEach((tile) => {
  tile.addEventListener('mouseenter', () => {
    currentTile = tile;
    updateTooltip(tile);
  });
  tile.addEventListener('mouseleave', () => {
    hideTooltip();
  });
});

// Обновление положения или скрытие при прокрутке
vp.addEventListener('scroll', () => {
  if (currentTile) updateTooltip(currentTile);
});

// Горизонтальная прокрутка колесиком
vp.addEventListener('wheel', (e) => {
  if (e.deltaY !== 0) {
    e.preventDefault();
    vp.scrollLeft += e.deltaY * 1.5;
  }
}, { passive: false });

// Drag-to-scroll
let isDown = false, startX, scrollLeft;
vp.addEventListener('mousedown', (e) => {
  if (e.target.closest('.tile')) return;
  isDown = true;
  startX = e.pageX - vp.offsetLeft;
  scrollLeft = vp.scrollLeft;
});
window.addEventListener('mouseup', () => isDown = false);
vp.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  vp.scrollLeft = scrollLeft - (e.pageX - vp.offsetLeft - startX) * 1.6;
});
