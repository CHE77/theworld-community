document.addEventListener('DOMContentLoaded', () => {
  const menus = [...document.querySelectorAll('.mobile-menu, .topic-menu')];
  for (const menu of menus) {
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) menu.open = false;
    });
    menu.addEventListener('toggle', () => {
      if (menu.open) for (const other of menus) if (other !== menu) other.open = false;
    });
  }
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    for (const menu of menus) {
      if (menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    }
  });
  document.addEventListener('click', event => {
    for (const menu of menus) if (!menu.contains(event.target)) menu.open = false;
  });
});
