import { FC, HTMLAttributes, useRef, useState } from 'react';
import { useDOM } from '../../lib/dom';
import { classNames } from '../../lib/classNames';
import { AppRootContext } from './AppRootContext';
import { withAdaptivity, SizeType, AdaptivityProps } from '../../hoc/withAdaptivity';
import { useIsomorphicLayoutEffect } from '../../lib/useIsomorphicLayoutEffect';
import { classScopingMode } from '../../lib/classScopingMode';
import { IconSettingsProvider } from '@vkontakte/icons';
import { noop } from '../../lib/utils';

// Используйте classList, но будьте осторожны
/* eslint-disable no-restricted-properties */

export interface AppRootProps extends HTMLAttributes<HTMLDivElement>, AdaptivityProps {
  /** @deprecated Use mode="embedded" */
  embedded?: boolean;
  /** Режим встраивания */
  mode?: 'partial' | 'embedded' | 'full';
  window?: Window;
  /** Убирает классы без префикса (.Button) */
  noLegacyClasses?: boolean;
}

const AppRoot: FC<AppRootProps> = ({ children, mode, embedded, sizeX, hasMouse, noLegacyClasses = false }) => {
  if (mode && embedded) {
    console.error(`[AppRoot] mode="${mode}" overrides embedded`);
  }
  mode = mode || (embedded ? 'embedded' : 'full');

  const rootRef = useRef<HTMLDivElement>();
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement>(null);
  const { window, document } = useDOM();

  const initialized = useRef(false);
  if (!initialized.current) {
    if (window && mode === 'full') {
      document.documentElement.classList.add('vkui');
    }
    classScopingMode.noConflict = noLegacyClasses;
    initialized.current = true;
  }

  // setup portal
  useIsomorphicLayoutEffect(() => {
    if (mode === 'full') {
      return noop;
    }

    const portal = document.createElement('div');
    portal.classList.add('vkui__portal-root');
    document.body.appendChild(portal);
    setPortalRoot(portal);
    return () => portal.parentElement.removeChild(portal);
  }, []);

  // setup root classes
  useIsomorphicLayoutEffect(() => {
    if (mode === 'partial') {
      return noop;
    }

    const parent = rootRef.current.parentElement;
    const classes = ['vkui__root'].concat(mode === 'embedded' ? 'vkui__root--embedded' : []);
    parent.classList.add(...classes);

    return () => {
      parent.classList.remove(...classes);
      if (mode === 'full') {
        document.documentElement.classList.remove('vkui');
      }
    };
  }, []);

  // adaptivity handler
  useIsomorphicLayoutEffect(() => {
    if (mode === 'partial') {
      return noop;
    }
    const container = mode === 'embedded' ? rootRef.current.parentElement : document.body;
    if (sizeX === SizeType.REGULAR) {
      container.classList.add('vkui--sizeX-regular');
    }
    return () => container.classList.remove('vkui--sizeX-regular');
  }, [sizeX]);

  const content = (
    <AppRootContext.Provider value={{
      appRoot: rootRef,
      portalRoot: portalRoot,
      embedded: mode === 'embedded',
    }}>
      <IconSettingsProvider classPrefix="vkui" globalClasses={!noLegacyClasses}>
        {children}
      </IconSettingsProvider>
    </AppRootContext.Provider>
  );

  return mode === 'partial'
    ? content
    : <div ref={rootRef} vkuiClass={classNames('AppRoot', { 'AppRoot--no-mouse': !hasMouse })}>{content}</div>;
};

export default withAdaptivity(AppRoot, {
  sizeX: true,
  hasMouse: true,
});
