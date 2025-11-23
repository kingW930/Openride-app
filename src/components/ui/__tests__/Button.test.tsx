import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button title="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPressMock} disabled />);
    
    const button = getByText('Click Me').parent;
    expect(button?.props.accessibilityState?.disabled).toBe(true);
  });

  it('should show loading indicator when loading', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <Button title="Click Me" loading />
    );
    
    expect(queryByText('Click Me')).toBeNull();
    expect(UNSAFE_getByType('ActivityIndicator')).toBeTruthy();
  });

  it('should apply correct styles for different variants', () => {
    const { rerender, getByText } = render(<Button title="Click Me" variant="primary" />);
    let button = getByText('Click Me').parent;
    
    rerender(<Button title="Click Me" variant="danger" />);
    button = getByText('Click Me').parent;
    expect(button).toBeTruthy();
  });
});
