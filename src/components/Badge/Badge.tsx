import { HTMLAttributes, FunctionComponent } from 'react';
import { getClassName } from '../../helpers/getClassName';
import { classNames } from '../../lib/classNames';
import { usePlatform } from '../../hooks/usePlatform';

export interface BadgeProps extends HTMLAttributes<HTMLElement> {
  mode: 'new' | 'prominent';
};

export const Badge: FunctionComponent<BadgeProps> = ({
  mode,
  ...restProps
}: BadgeProps) => {
  const platform = usePlatform();

  return (
    <div
      vkuiClass={classNames(
        getClassName('Badge', platform),
        `Badge--${mode}`,
      )}
      {...restProps}>
    </div>
  );
};

Badge.defaultProps = {
  mode: 'new',
};
