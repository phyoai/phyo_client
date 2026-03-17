import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../ui/Button';

/**
 * Example Test Suite for Button Component
 *
 * To run tests:
 * npm test                 - Run all tests once
 * npm run test:watch      - Run tests in watch mode
 * npm run test:coverage   - Run tests with coverage report
 */

describe('Button Component', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click</Button>);
        const button = screen.getByRole('button');

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('disables button when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('renders with different variants', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>);
        let button = screen.getByRole('button');
        expect(button).toHaveClass('primary');

        rerender(<Button variant="secondary">Secondary</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('secondary');
    });

    it('renders with different sizes', () => {
        const { rerender } = render(<Button size="small">Small</Button>);
        let button = screen.getByRole('button');
        expect(button).toHaveClass('small');

        rerender(<Button size="large">Large</Button>);
        button = screen.getByRole('button');
        expect(button).toHaveClass('large');
    });

    it('renders children correctly', () => {
        render(
            <Button>
                <span>Icon</span>
                Text
            </Button>
        );
        expect(screen.getByText('Icon')).toBeInTheDocument();
        expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('handles loading state', () => {
        render(<Button loading>Loading</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
