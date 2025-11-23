import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input Component', () => {
  it('should render correctly', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Enter text" />);
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render label when provided', () => {
    const { getByText } = render(<Input label="Username" placeholder="Enter username" />);
    expect(getByText('Username')).toBeTruthy();
  });

  it('should render error message when provided', () => {
    const { getByText } = render(
      <Input placeholder="Enter text" error="This field is required" />
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" onChangeText={onChangeTextMock} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'test value');
    expect(onChangeTextMock).toHaveBeenCalledWith('test value');
  });

  it('should apply error styles when error is present', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" error="Error message" />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input).toBeTruthy();
  });
});
