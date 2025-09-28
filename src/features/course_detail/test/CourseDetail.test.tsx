import React from 'react';
import { render, screen } from '@testing-library/react';
import CourseDetail from '../CourseDetail';

describe('CourseDetail', () => {
  test('renders course title', () => {
    render(<CourseDetail />);
    const titleElement = screen.getByText(/Complete Website Responsive Design/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders course description', () => {
    render(<CourseDetail />);
    const descriptionElement = screen.getByText(/3 in 1 Course: Learn to design websites/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  test('renders instructor names', () => {
    render(<CourseDetail />);
    const instructor1 = screen.getByText(/Dianne Russell/i);
    const instructor2 = screen.getByText(/Kristin Watson/i);
    expect(instructor1).toBeInTheDocument();
    expect(instructor2).toBeInTheDocument();
  });

  test('renders course rating', () => {
    render(<CourseDetail />);
    const ratingElement = screen.getByText(/4.8/);
    expect(ratingElement).toBeInTheDocument();
  });

  test('renders enroll button', () => {
    render(<CourseDetail />);
    const enrollButton = screen.getByText(/Enroll Now/i);
    expect(enrollButton).toBeInTheDocument();
  });
});
