import { render } from '@testing-library/react';
import { noop } from '@vkontakte/vkjs';
import { baselineComponent } from '../../testing/utils';
import { Link } from './Link';
import styles from './Link.module.css';

describe(Link, () => {
  baselineComponent((props) => (
    <Link href="https://vk.com" {...props}>
      Link
    </Link>
  ));

  it('should use button role', () => {
    const result = render(<Link onClick={noop} />);
    expect(result.getByRole('button')).toBeInTheDocument();
  });

  it('should use link role', () => {
    const result = render(<Link href="https://vk.com" />);
    expect(result.getByRole('link')).toBeInTheDocument();
  });

  it('should use div role when no href is provided', () => {
    const result = render(<Link />);
    expect(result.queryByRole('button')).not.toBeInTheDocument();
    expect(result.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render before and after elements', () => {
    const result = render(
      <Link
        href="https://vk.com"
        before={<span data-testid="before" />}
        after={<span data-testid="after" />}
      />,
    );

    expect(result.getByTestId('before')).toBeInTheDocument();
    expect(result.getByTestId('after')).toBeInTheDocument();
  });

  it('should disable underline', () => {
    const result = render(<Link href="https://vk.com" />);
    expect(result.getByRole('link')).toHaveClass(styles.withUnderline);

    result.rerender(<Link href="https://vk.com" noUnderline />);
    expect(result.getByRole('link')).not.toHaveClass(styles.withUnderline);
  });

  it('should use visited style', () => {
    const result = render(<Link href="https://vk.com" />);
    expect(result.getByRole('link')).not.toHaveClass(styles.hasVisited);

    result.rerender(<Link href="https://vk.com" hasVisited />);
    expect(result.getByRole('link')).toHaveClass(styles.hasVisited);
  });
});
