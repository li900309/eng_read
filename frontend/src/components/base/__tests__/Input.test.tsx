import React from 'react';
import { fireEvent, screen } from '@/test/utils/test-utils';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex', 'h-10', 'w-full');
  });

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('renders with error state', () => {
    render(<Input error="This field is required" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveError('This field is required');
  });

  it('renders with helper text', () => {
    render(<Input helperText="Enter a valid email address" />);

    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Input value="test" onChange={handleChange} />);

    const input = screen.getByDisplayValue('test');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />);

    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  it('renders as different input types', () => {
    render(<Input type="password" placeholder="Enter password" />);

    const input = screen.getByPlaceholderText('Enter password') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('renders with left icon', () => {
    const Icon = () => <span data-testid="left-icon">Icon</span>;
    render(<Input leftIcon={<Icon />} placeholder="With icon" />);

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('With icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const Icon = () => <span data-testid="right-icon">Icon</span>;
    render(<Input rightIcon={<Icon />} placeholder="With icon" />);

    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('With icon')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<Input label="Required Field" required />);

    expect(screen.getByText('Required Field *')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Input aria-label="Custom input" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Custom input');
  });

  it('associates label with input', () => {
    render(<Input id="test-input" label="Test Label" />);

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test Label');

    expect(input).toHaveAttribute('id', 'test-input');
    expect(label).toHaveAttribute('for', 'test-input');
  });
});