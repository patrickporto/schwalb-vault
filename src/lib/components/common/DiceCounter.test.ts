import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import DiceCounter from './DiceCounter.svelte';
import userEvent from '@testing-library/user-event';

describe('DiceCounter', () => {
    it('should render with initial value', () => {
      render(DiceCounter, { value: 3, onUpdate: vi.fn() });
        expect(screen.getByText('3d6')).toBeInTheDocument();
    });

    it('should render with label when provided', () => {
      render(DiceCounter, { value: 2, label: 'Damage (d6)', onUpdate: vi.fn() });
        expect(screen.getByText('Damage (d6)')).toBeInTheDocument();
        expect(screen.getByText('2d6')).toBeInTheDocument();
    });

    it('should render without label when not provided', () => {
      const { container } = render(DiceCounter, { value: 1, onUpdate: vi.fn() });
        const label = container.querySelector('.text-indigo-300');
        expect(label).not.toBeInTheDocument();
    });

    it('should call onUpdate with incremented value when plus button is clicked', async () => {
        const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(DiceCounter, { value: 2, onUpdate });
      const plusButton = screen.getByLabelText('Increase');
      await user.click(plusButton);
        expect(onUpdate).toHaveBeenCalledWith(3);
    });

    it('should call onUpdate with decremented value when minus button is clicked', async () => {
        const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(DiceCounter, { value: 3, onUpdate });
      const minusButton = screen.getByLabelText('Decrease');
      await user.click(minusButton);
        expect(onUpdate).toHaveBeenCalledWith(2);
    });

    it('should not decrement below minimum value (default 0)', async () => {
        const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(DiceCounter, { value: 0, onUpdate });
      const minusButton = screen.getByLabelText('Decrease');
      await user.click(minusButton);
        expect(onUpdate).toHaveBeenCalledWith(0);
    });

    it('should respect custom minimum value', async () => {
        const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(DiceCounter, { value: 5, min: 5, onUpdate });
      const minusButton = screen.getByLabelText('Decrease');
      await user.click(minusButton);
        expect(onUpdate).toHaveBeenCalledWith(5);
    });

    it('should allow decrementing above custom minimum', async () => {
        const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(DiceCounter, { value: 6, min: 5, onUpdate });
      const minusButton = screen.getByLabelText('Decrease');
      await user.click(minusButton);
        expect(onUpdate).toHaveBeenCalledWith(5);
    });

    it('should update display when value prop changes', async () => {
      const onUpdate = vi.fn();
      const { rerender } = render(DiceCounter, { value: 2, onUpdate });
      expect(screen.getByText('2d6')).toBeInTheDocument();
      await rerender({ value: 5, onUpdate });
        expect(screen.getByText('5d6')).toBeInTheDocument();
    });

    it('should have proper button accessibility attributes', () => {
      render(DiceCounter, { value: 1, onUpdate: vi.fn() });
      const minusButton = screen.getByLabelText('Decrease');
      const plusButton = screen.getByLabelText('Increase');
        expect(minusButton).toHaveAttribute('type', 'button');
      expect(minusButton).toHaveAttribute('aria-label', 'Decrease');
        expect(plusButton).toHaveAttribute('type', 'button');
      expect(plusButton).toHaveAttribute('aria-label', 'Increase');
    });

  it('should display dice notation correctly for various values', async () => {
    const onUpdate = vi.fn();
    const { rerender } = render(DiceCounter, { value: 0, onUpdate });
      expect(screen.getByText('0d6')).toBeInTheDocument();
      await rerender({ value: 1, onUpdate });
      expect(screen.getByText('1d6')).toBeInTheDocument();
      await rerender({ value: 10, onUpdate });
        expect(screen.getByText('10d6')).toBeInTheDocument();
    });

    it('should handle custom steps correctly', async () => {
        const user = userEvent.setup();
        const onUpdate = vi.fn();
      const customSteps = ['1', '1d3'];
        const { rerender } = render(DiceCounter, { value: 0, customSteps, onUpdate });

      await user.click(screen.getByLabelText('Increase'));
        expect(onUpdate).toHaveBeenCalledWith('1');

      await rerender({ value: '1', customSteps, onUpdate });
      await user.click(screen.getByLabelText('Increase'));
        expect(onUpdate).toHaveBeenCalledWith('1d3');

      await rerender({ value: '1d3', customSteps, onUpdate });
      await user.click(screen.getByLabelText('Increase'));
        expect(onUpdate).toHaveBeenCalledWith(1);

      await rerender({ value: 1, customSteps, onUpdate });
      await user.click(screen.getByLabelText('Decrease'));
        expect(onUpdate).toHaveBeenCalledWith('1d3');

      await rerender({ value: '1d3', customSteps, onUpdate });
      await user.click(screen.getByLabelText('Decrease'));
        expect(onUpdate).toHaveBeenCalledWith('1');

      await rerender({ value: '1', customSteps, onUpdate });
      await user.click(screen.getByLabelText('Decrease'));
        expect(onUpdate).toHaveBeenCalledWith(0);
    });

    it('should format string values correctly', () => {
        render(DiceCounter, { value: '1d3', onUpdate: vi.fn() });
        expect(screen.getByText('1d3')).toBeInTheDocument();
    });
});
