import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function RouteFocus() {
  const { pathname } = useLocation();
  useEffect(() => {
    const heading = document.querySelector('h1');
    document.title = `${heading?.textContent ?? 'Страница'} | Business Process Monitor`;
    heading?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
