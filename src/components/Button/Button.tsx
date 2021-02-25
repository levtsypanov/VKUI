import { FunctionComponent, ReactNode, useRef } from 'react';
import { getClassName } from '../../helpers/getClassName';
import { classNames } from '../../lib/classNames';
import Tappable, { TappableProps } from '../Tappable/Tappable';
import Title from '../Typography/Title/Title';
import Text from '../Typography/Text/Text';
import Subhead from '../Typography/Subhead/Subhead';
import Caption from '../Typography/Caption/Caption';
import { HasAlign } from '../../types';
import { usePlatform } from '../../hooks/usePlatform';
import { withAdaptivity, AdaptivityProps, SizeType } from '../../hoc/withAdaptivity';
import { Platform, VKCOM } from '../../lib/platform';
import { useFocusRing } from '@react-aria/focus';
import { useButton } from '@react-aria/button';

export interface VKUIButtonProps extends HasAlign {
  mode?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'commerce' | 'destructive' | 'overlay_primary' | 'overlay_secondary' | 'overlay_outline';
  size?: 's' | 'm' | 'l';
  stretched?: boolean;
  before?: ReactNode;
  after?: ReactNode;
}

export interface ButtonProps extends Omit<TappableProps, 'size'>, VKUIButtonProps {}

const getContent = (size: ButtonProps['size'], children: ButtonProps['children'], hasIcons: boolean, sizeY: AdaptivityProps['sizeY'], platform: Platform) => {
  switch (size) {
    case 'l':
      return (
        sizeY === SizeType.COMPACT ?
          <Text weight="medium" Component="span" vkuiClass="Button__content">{children}</Text>
          :
          <Title level="3" weight="medium" Component="span" vkuiClass="Button__content">
            {children}
          </Title>
      );
    case 'm':
      return (
        sizeY === SizeType.COMPACT ?
          <Subhead weight={platform === VKCOM ? 'regular' : 'medium'} vkuiClass="Button__content" Component="span">
            {children}
          </Subhead>
          :
          <Text weight="medium" vkuiClass="Button__content" Component="span">
            {children}
          </Text>
      );
    case 's':
    default:
      if (hasIcons) {
        return (
          <Caption
            Component="span"
            caps={platform !== Platform.VKCOM}
            level={platform === Platform.VKCOM ? '1' : sizeY === SizeType.COMPACT ? '3' : '2'}
            weight={platform === Platform.VKCOM ? 'regular' : 'medium'}
            vkuiClass={classNames('Button__content', { 'Button__content--caps': platform !== Platform.VKCOM })}
          >
            {children}
          </Caption>
        );
      }

      return (
        sizeY === SizeType.COMPACT ?
          <Caption
            weight={platform === VKCOM ? 'regular' : 'medium'}
            level="1"
            Component="span"
            vkuiClass="Button__content"
          >
            {children}
          </Caption>
          :
          <Subhead
            weight="medium"
            Component="span"
            vkuiClass="Button__content"
          >
            {children}
          </Subhead>
      );
  }
};

const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const platform = usePlatform();
  const { size, mode, stretched, align, children, before, after, getRootRef, Component, sizeY, ...restProps } = props;
  const hasIcons = Boolean(before || after);

  const _buttonRef = useRef<HTMLButtonElement>(null);
  const buttonRef = getRootRef ? getRootRef : _buttonRef;

  // something is wrong w/ Button props (Types of property ''aria-expanded'' are incompatible),
  // looks like it's not our fault
  // @ts-ignore
  const { buttonProps } = useButton({ ...restProps, elementType: Component }, buttonRef);
  const { isFocusVisible, focusProps } = useFocusRing();
  // onPointerDown переписывает текущую логику подсветки в Tappable
  const { onPointerDown, ...restButtonProps } = buttonProps;

  return (
    <Tappable
      {...focusProps}
      {...restButtonProps}
      {...restProps}
      vkuiClass={
        classNames(
          getClassName('Button', platform),
          `Button--sz-${size}`,
          `Button--lvl-${mode}`,
          `Button--aln-${align}`,
          `Button--sizeY-${sizeY}`,
          {
            'Button--str': stretched,
            'Button--with-icon': hasIcons,
            'Button--focus-visible': isFocusVisible,
          },
        )
      }
      getRootRef={buttonRef}
      Component={restProps.href ? 'a' : Component}
      activeMode="opacity"
    >
      <span vkuiClass="Button__in">
        {before && <div vkuiClass="Button__before">{before}</div>}
        {children && getContent(size, children, hasIcons, sizeY, platform)}
        {after && <div vkuiClass="Button__after">{after}</div>}
      </span>
    </Tappable>
  );
};

Button.defaultProps = {
  mode: 'primary',
  Component: 'button',
  align: 'center',
  size: 's',
  stretched: false,
  stopPropagation: true,
};

export default withAdaptivity(Button, {
  sizeY: true,
});
