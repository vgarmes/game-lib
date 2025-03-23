import { beforeEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import NumberInput from './number-input';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

const NumberInputTest = ({
  initialValue = null,
  minValue,
  maxValue,
  disabled = false,
}: {
  initialValue?: number | null;
  minValue?: number;
  maxValue?: number;
  disabled?: boolean;
}) => {
  const [value, setValue] = useState<number | null>(initialValue);
  return (
    <NumberInput
      value={value}
      onChange={setValue}
      min={minValue}
      max={maxValue}
      disabled={disabled}
    />
  );
};

beforeEach(() => {
  cleanup();
});

test('Number input changes value when using numpad', async () => {
  const { user } = setup(<NumberInputTest />);

  const input: HTMLInputElement = screen.getByTestId('number-input__input');

  await user.click(input);
  await user.keyboard('{1}{0}');
  expect(input.value).toBe('10');
});

test('Number input changes value when using buttons', async () => {
  const { user } = setup(<NumberInputTest />);

  const input: HTMLInputElement = screen.getByTestId('number-input__input');
  const incrementButton = screen.getByTestId('number-input__increment');
  const decrementButton = screen.getByTestId('number-input__decrement');

  await user.click(incrementButton);
  expect(input.value).toBe('1');
  await user.click(decrementButton);
  expect(input.value).toBe('0');
});

test('Number input with value out of bounds resets on blur', async () => {
  const { user } = setup(<NumberInputTest maxValue={10} />);

  const input: HTMLInputElement = screen.getByTestId('number-input__input');

  await user.click(input);
  await user.keyboard('{2}{0}');
  expect(input.value).toBe('20');
  await user.click(document.body);
  expect(input.value).toBe('10');
});

test('User is able to delete', async () => {
  const { user } = setup(<NumberInputTest initialValue={10} />);

  const input: HTMLInputElement = screen.getByTestId('number-input__input');

  await user.click(input);
  await user.keyboard('{Backspace}{Backspace}');
  expect(input.value).toBe('');
});

test('Number input with disabled prop does not change value', async () => {
  const { user } = setup(<NumberInputTest initialValue={10} disabled={true} />);

  const input: HTMLInputElement = screen.getByTestId('number-input__input');
  const incrementButton = screen.getByTestId('number-input__increment');

  await user.click(input);
  await user.keyboard('{5}');
  await user.click(incrementButton);
  expect(input.value).toBe('10');
});
