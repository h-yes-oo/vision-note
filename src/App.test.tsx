import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('your test suite', () => {
  window.URL.createObjectURL = jest.fn();

  afterEach(() => {
    window.URL.createObjectURL.mockReset();
  });

  it('your test case', () => {
    expect(true).toBeTruthy();
  });
});
