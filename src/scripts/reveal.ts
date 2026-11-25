// Apparition au défilement (une seule fois par élément).
// Seuls les éléments encore hors de l'écran au chargement sont concernés :
// rien de ce qui est déjà visible ne disparaît puis réapparaît.
const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

if ('IntersectionObserver' in window && elements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-reveal', 'shown');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  const fold = window.innerHeight;
  for (const el of elements) {
    if (el.getBoundingClientRect().top > fold) {
      el.setAttribute('data-reveal', 'pending');
      observer.observe(el);
    }
  }
}
