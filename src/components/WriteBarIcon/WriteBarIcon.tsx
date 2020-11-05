import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { Icon24Send, Icon28AddCircleOutline, Icon28AttachOutline, Icon48WritebarSend } from '@vkontakte/icons';
import { usePlatform } from '../../hooks/usePlatform';
import { classNames } from '../../lib/classNames';
import { getClassName } from '../../helpers/getClassName';
import { IOS } from '../../lib/platform';

export interface WriteBarIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Предустановленные типы кнопок в WriteBar для отрисовки иконки в зависимости от платформы.
   * Если передать валидное значение для этого свойства, `children` игнорируется.
   *
   * - `attach` – иконка прикрепления.
   * - `send` – иконка отправки.
   */
  mode?: 'attach' | 'send';
  /**
   * Значение счётчика для кнопки. Например, для количества прикреплённых файлов.
   */
  count?: number;
}

export const WriteBarIcon: FC<WriteBarIconProps> = (props) => {
  const platform = usePlatform();
  const {
    mode,
    className,
    disabled,
    children,
    count,
    ...restProps
  } = props;

  let childrenResolved: ReactNode;

  switch (mode) {
    case 'attach':
      childrenResolved = platform === IOS ? <Icon28AddCircleOutline /> : <Icon28AttachOutline />;
      break;

    case 'send':
      childrenResolved = platform === IOS ? <Icon48WritebarSend /> : <Icon24Send />;
      break;

    default:
      childrenResolved = children;
  }

  return (
    <button
      {...restProps}
      className={classNames(getClassName('WriteBarIcon', platform), {
        [`WriteBarIcon--${mode}`]: !!mode,
        'WriteBarIcon--disabled': disabled,
      }, className)}
      disabled={disabled}
    >
      {childrenResolved}
      {count ? <div className="WriteBarIcon__count">{count}</div> : null}
    </button>
  );
};
