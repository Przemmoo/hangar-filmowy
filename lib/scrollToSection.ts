export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (!element) return;

  // Offset scrollowania - mniejszy niż wysokość navbara
  const scrollOffset = 10;

  // Sprawdź czy baner KPO jest widoczny
  const kpoBanner = document.querySelector('[class*="fixed top-0"][class*="z-[60]"]');
  const kpoBannerVisible = kpoBanner && window.scrollY <= 10;

  // Jeśli baner jest widoczny, wymuś jego ukrycie
  if (kpoBannerVisible) {
    window.dispatchEvent(new CustomEvent('hideKPOBanner'));
    // Czekaj na ukrycie banera przed scrollowaniem
    setTimeout(() => {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - scrollOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 100);
  } else {
    // Baner już ukryty, scrolluj od razu
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - scrollOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
