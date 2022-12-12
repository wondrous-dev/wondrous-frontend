/**
 * https://gist.github.com/lenkan/357b006dd31a8c78f659430467369ea7
 */

import { useState, useEffect } from 'react';

function getCurrentLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
  };
}

/**
 * @type {Array<() => void>}
 */
const listeners = [];

/**
 * Notifies all location listeners. Can be used if the history state has been manipulated
 * in by another module. Effectifely, all components using the 'useLocation' hook will
 * update.
 */
export function notify() {
  listeners.forEach((listener) => listener());
}

/**
 * Please use React Router instead of this hook.
 * @deprecated
 */
export function useLocation() {
  const [location, setLocation] = useState(null);
  const urlParams = new URLSearchParams(location?.search);
  const params = Object.fromEntries(urlParams.entries());

  useEffect(() => {
    window.addEventListener('popstate', handleChange);
    return () => window.removeEventListener('popstate', handleChange);
  }, []);

  useEffect(() => {
    listeners.push(handleChange);
    return () => {
      listeners.splice(listeners.indexOf(handleChange), 1);
    };
  }, []);

  function handleChange() {
    setLocation(getCurrentLocation());
  }

  useEffect(() => {
    setLocation(getCurrentLocation());
  }, []);
  /**
   * @param {string} url
   */
  function push(url) {
    window.history.pushState({}, '', url);
    notify();
  }

  /**
   * @param {string} url
   */
  function replace(url) {
    window.history.replaceState({ ...window.history.state, as: url, url }, '', url);
    notify();
  }

  return {
    push,
    replace,
    pathname: location?.pathname,
    search: location?.search,
    params,
  };
}
