import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Alert } from './Alert';

describe('Alert', () => {
  it('renders its children', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it.each(['warning', 'danger'] as const)(
    'uses role="alert" for the %s variant',
    (variant) => {
      render(<Alert variant={variant}>Message</Alert>);
      expect(screen.getByRole('alert')).toHaveTextContent('Message');
    },
  );

  it.each(['primary', 'info', 'success'] as const)(
    'uses role="status" for the %s variant',
    (variant) => {
      render(<Alert variant={variant}>Message</Alert>);
      expect(screen.getByRole('status')).toHaveTextContent('Message');
    },
  );

  it('falls back to the primary variant when none is passed', () => {
    render(<Alert>Message</Alert>);
    const alert = screen.getByRole('status');
    expect(alert).toHaveClass('bg-tally-primary');
  });

  it('applies the classes for the chosen variant', () => {
    render(<Alert variant="danger">Message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-tally-danger');
  });

  it('exposes the resolved variant as a data attribute', () => {
    render(<Alert variant="warning">Message</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute(
      'data-variant',
      'warning',
    );
  });

  it('reports the default variant when none is passed', () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole('status')).toHaveAttribute(
      'data-variant',
      'primary',
    );
  });

  it('renders an icon that is hidden from assistive tech', () => {
    const { container } = render(<Alert variant="success">Message</Alert>);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('merges a consumer className and passes other props through', () => {
    render(
      <Alert variant="info" className="custom-class" id="my-alert">
        Message
      </Alert>,
    );
    const alert = screen.getByRole('status');
    expect(alert).toHaveClass('custom-class');
    expect(alert).toHaveClass('bg-tally-info');
    expect(alert).toHaveAttribute('id', 'my-alert');
  });

  it('does not let a consumer override the role', () => {
    render(
      <Alert variant="danger" role="region">
        Message
      </Alert>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});

describe('Alert.Title and Alert.Description', () => {
  it('render their content inside the alert', () => {
    render(
      <Alert variant="danger">
        <Alert.Title>Open recall</Alert.Title>
        <Alert.Description>Contact your dealer.</Alert.Description>
      </Alert>,
    );

    const alert = screen.getByRole('alert');
    expect(within(alert).getByText('Open recall')).toBeInTheDocument();
    expect(within(alert).getByText('Contact your dealer.')).toBeInTheDocument();
  });

  it('merge a consumer className and pass other props through', () => {
    render(
      <Alert>
        <Alert.Title className="title-class" id="title-id">
          Title
        </Alert.Title>
        <Alert.Description className="description-class" id="description-id">
          Description
        </Alert.Description>
      </Alert>,
    );

    const title = screen.getByText('Title');
    const description = screen.getByText('Description');
    expect(title).toHaveClass('title-class');
    expect(title).toHaveAttribute('id', 'title-id');
    expect(description).toHaveClass('description-class');
    expect(description).toHaveAttribute('id', 'description-id');
  });
});
