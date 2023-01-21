import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/Input';

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
