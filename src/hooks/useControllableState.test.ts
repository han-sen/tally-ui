import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import {
  useControllableState,
  type UseControllableStateOptions,
} from './useControllableState';

function renderControllable<V>(initialProps: UseControllableStateOptions<V>) {
  return renderHook((props) => useControllableState(props), { initialProps });
}

describe('useControllableState', () => {
  describe('uncontrolled', () => {
    it('starts at defaultValue', () => {
      const { result } = renderControllable({
        value: undefined,
        defaultValue: 'apple',
      });

      expect(result.current[0]).toBe('apple');
    });

    it('updates its own value when set', () => {
      const { result } = renderControllable({
        value: undefined,
        defaultValue: 'apple',
      });

      act(() => result.current[1]('banana'));

      expect(result.current[0]).toBe('banana');
    });

    it('calls onChange with the next value', () => {
      const onChange = vi.fn();
      const { result } = renderControllable({
        value: undefined,
        defaultValue: 'apple',
        onChange,
      });

      act(() => result.current[1]('banana'));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith('banana');
    });

    it('ignores defaultValue changes after the first render', () => {
      const { result, rerender } = renderControllable({
        value: undefined,
        defaultValue: 'apple',
      });

      rerender({ value: undefined, defaultValue: 'cherry' });

      expect(result.current[0]).toBe('apple');
    });
  });

  describe('controlled', () => {
    it('returns value instead of defaultValue', () => {
      const { result } = renderControllable({
        value: 'banana',
        defaultValue: 'apple',
      });

      expect(result.current[0]).toBe('banana');
    });

    it('does not change its value when set; the parent decides', () => {
      const { result } = renderControllable({
        value: 'banana',
        defaultValue: 'apple',
      });

      act(() => result.current[1]('cherry'));

      expect(result.current[0]).toBe('banana');
    });

    it('calls onChange with the next value', () => {
      const onChange = vi.fn();
      const { result } = renderControllable({
        value: 'banana',
        defaultValue: 'apple',
        onChange,
      });

      act(() => result.current[1]('cherry'));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith('cherry');
    });

    it('follows value when the parent changes it', () => {
      const { result, rerender } = renderControllable({
        value: 'banana',
        defaultValue: 'apple',
      });

      rerender({ value: 'cherry', defaultValue: 'apple' });

      expect(result.current[0]).toBe('cherry');
    });

    it('treats null as a controlled value, not as uncontrolled', () => {
      const { result } = renderControllable<string | null>({
        value: null,
        defaultValue: 'apple',
      });

      act(() => result.current[1]('banana'));

      expect(result.current[0]).toBeNull();
    });
  });

  it('does not call onChange when set to the current value', () => {
    const onChange = vi.fn();
    const { result } = renderControllable({
      value: undefined,
      defaultValue: 'apple',
      onChange,
    });

    act(() => result.current[1]('apple'));

    expect(onChange).not.toHaveBeenCalled();
  });

  describe('function values', () => {
    const byName = vi.fn(() => 0);
    const byDate = vi.fn(() => 1);

    it('stores a function defaultValue without calling it', () => {
      const { result } = renderControllable({
        value: undefined,
        defaultValue: byName,
      });

      expect(result.current[0]).toBe(byName);
      expect(byName).not.toHaveBeenCalled();
    });

    it('stores a function set as the next value without calling it', () => {
      const { result } = renderControllable({
        value: undefined,
        defaultValue: byName,
      });

      act(() => result.current[1](byDate));

      expect(result.current[0]).toBe(byDate);
      expect(byDate).not.toHaveBeenCalled();
    });
  });
});
