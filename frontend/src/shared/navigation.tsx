import { useSyncExternalStore, type AnchorHTMLAttributes } from 'react';

const subscribe = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
};
export function useLocation() {
  return useSyncExternalStore(subscribe, () => window.location.pathname + window.location.search);
}
export function navigate(href: string, replace = false) {
  window.history[replace ? 'replaceState' : 'pushState']({}, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}
export function Link({ href = '/', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} href={href} onClick={event => {
    onClick?.(event);
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !props.target) {
      event.preventDefault(); navigate(href);
    }
  }} />;
}
