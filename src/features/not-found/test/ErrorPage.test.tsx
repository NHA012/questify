import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
  it('renders the error code', () => {
    render(<ErrorPage />);
    const errorCode = screen.getByText(/Error 404/i);
    expect(errorCode).toBeInTheDocument();
  });

  it('renders the error title', () => {
    render(<ErrorPage />);
    const errorTitle = screen.getByText(/Oops! page not found/i);
    expect(errorTitle).toBeInTheDocument();
  });

  it('renders the error description', () => {
    render(<ErrorPage />);
    const errorDescription = screen.getByText(/Something went wrong/i);
    expect(errorDescription).toBeInTheDocument();
  });

  it('renders the "Go Back" button', () => {
    render(<ErrorPage />);
    const goBackButton = screen.getByText(/Go Back/i);
    expect(goBackButton).toBeInTheDocument();
  });

  it('renders support links', () => {
    render(<ErrorPage />);
    const faqLink = screen.getByText(/FAQs/i);
    const privacyLink = screen.getByText(/Privacy Policy/i);
    const termsLink = screen.getByText(/Terms & Condition/i);
    expect(faqLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
    expect(termsLink).toBeInTheDocument();
  });

  it('renders the footer text', () => {
    render(<ErrorPage />);
    const footerText = screen.getByText(/© 2021 - Eduguard/i);
    expect(footerText).toBeInTheDocument();
  });
});
