import React from 'react';

export const StackIcon: React.FC<{ isActive?: boolean }> = ({ isActive }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      opacity="0.2"
      d="M3 7.5L12 12.75L21 7.5L12 2.25L3 7.5Z"
      fill={isActive ? '#00ADB5' : '#6E7485'}
    ></path>
    <path
      d="M3 16.5L12 21.75L21 16.5"
      stroke={isActive ? '#00ADB5' : '#6E7485'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M3 12L12 17.25L21 12"
      stroke={isActive ? '#00ADB5' : '#6E7485'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M3 7.5L12 12.75L21 7.5L12 2.25L3 7.5Z"
      stroke={isActive ? '#00ADB5' : '#6E7485'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

export const MonitorPlayIcon: React.FC<{ isActive?: boolean }> = ({ isActive }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      opacity="0.2"
      d="M19.5 4.5H4.5C4.10218 4.5 3.72065 4.65804 3.43934 4.93934C3.15804 5.22065 3 5.60218 3 6V16.5C3 16.8978 3.15804 17.2794 3.43934 17.5607C3.72065 17.842 4.10218 18 4.5 18H19.5C19.8978 18 20.2794 17.842 20.5607 17.5607C20.842 17.2794 21 16.8978 21 16.5V6C21 5.60218 20.842 5.22065 20.5607 4.93934C20.2794 4.65804 19.8978 4.5 19.5 4.5ZM10.5 14.25V8.25L15 11.25L10.5 14.25Z"
      fill={isActive ? '#00ADB5' : '#6E7485'}
    ></path>
    <path
      d="M4.5 18L19.5 18C20.3284 18 21 17.3284 21 16.5V6C21 5.17157 20.3284 4.5 19.5 4.5L4.5 4.5C3.67157 4.5 3 5.17157 3 6V16.5C3 17.3284 3.67157 18 4.5 18Z"
      stroke={isActive ? '#00ADB5' : '#6E7485'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M15 21H9"
      stroke={isActive ? '#00ADB5' : '#6E7485'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M15 11.25L10.5 8.25V14.25L15 11.25Z"
      stroke={isActive ? '#00ADB5' : '#6E7485'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

export const StudentsIcon: React.FC<{ isActive?: boolean }> = ({ isActive }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M8.25 15C10.9424 15 13.125 12.8174 13.125 10.125C13.125 7.43261 10.9424 5.25 8.25 5.25C5.55761 5.25 3.375 7.43261 3.375 10.125C3.375 12.8174 5.55761 15 8.25 15Z"
      stroke={isActive ? '#00ADB5' : '#6E7485'}
      strokeWidth="1.5"
      strokeMiterlimit="10"
    ></path>
    <path
      d="M14.5703 5.43076C15.2408 5.24184 15.9441 5.1988 16.6326 5.30454C17.3212 5.41029 17.9791 5.66236 18.562 6.04377C19.1449 6.42519 19.6393 6.92709 20.012 7.51568C20.3846 8.10427 20.6268 8.76588 20.7221 9.45594C20.8175 10.146 20.764 10.8485 20.565 11.5161C20.366 12.1837 20.0263 12.8009 19.5687 13.3262C19.1111 13.8514 18.5463 14.2726 17.9123 14.5611C17.2782 14.8497 16.5897 14.9991 15.8931 14.9992"
      stroke={isActive ? '#00ADB5' : '#6E7485'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M1.5 18.5059C2.26138 17.4229 3.27215 16.539 4.44698 15.9288C5.62182 15.3186 6.92623 15.0001 8.25008 15C9.57393 14.9999 10.8784 15.3184 12.0532 15.9285C13.2281 16.5386 14.239 17.4225 15.0004 18.5054"
      stroke={isActive ? '#00ADB5' : '#6E7485'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M15.8945 15C17.2185 14.999 18.5232 15.3171 19.6982 15.9273C20.8732 16.5375 21.8838 17.4218 22.6446 18.5054"
      stroke={isActive ? '#00ADB5' : '#6E7485'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

export const CheckIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="check-icon"
  >
    <path
      d="M13.875 7.875L5.625 16.125L1.5 12.0002"
      stroke={'#23BD33'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.5037 7.875L14.2537 16.125L12.0625 13.9339"
      stroke={'#23BD33'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
