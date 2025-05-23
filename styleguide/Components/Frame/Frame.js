import * as React from 'react';
import ReactFrame, { useFrame } from 'react-frame-component';
import { PanelSpinner } from '@vkui';
import { DOMContext } from '@vkui/lib/dom';
import { useLoadThemeTokens } from '../../lib/theme/useLoadThemeTokens';
import './Frame.css';

const FrameDomProvider = ({ colorSchemeOptions, themeName, children }) => {
  const [ready, setReady] = React.useState(false);
  const frame = useFrame();

  const loaded = useLoadThemeTokens(themeName, colorSchemeOptions, frame.document);

  React.useEffect(() => {
    const hotObservers = [];

    frame.document.querySelector('.frame-content').setAttribute('id', 'root');

    // Пихаем в iFrame vkui стили
    const frameAssets = document.createDocumentFragment();
    Array.from(document.getElementsByClassName('vkui-style')).map((style) => {
      const frameStyle = style.cloneNode(true);
      frameAssets.appendChild(frameStyle);

      if (process.env.NODE_ENV === 'development') {
        const hotStyleChange = new MutationObserver(() => {
          frameStyle.firstChild.nodeValue = style.firstChild.nodeValue;
        });
        hotStyleChange.observe(style, { characterData: true, childList: true });
        hotObservers.push(hotStyleChange);
      }
    });
    frame.document.head.appendChild(frameAssets);
    setReady(true);

    return () => {
      hotObservers.forEach((o) => o.disconnect());
    };
  }, []);

  return ready && loaded ? (
    <DOMContext.Provider value={frame}>{children}</DOMContext.Provider>
  ) : (
    <PanelSpinner />
  );
};

const initialFrameContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      #root {
        height: 100%;
      }
    </style>
  </head>
  <body>
  </body>
</html>
`;

export const Frame = ({ children, style, colorSchemeOptions, themeName }) => {
  return (
    <ReactFrame
      mountTarget="body"
      className="Frame"
      style={style}
      initialContent={initialFrameContent}
    >
      <FrameDomProvider colorSchemeOptions={colorSchemeOptions} themeName={themeName}>
        {children}
      </FrameDomProvider>
    </ReactFrame>
  );
};
