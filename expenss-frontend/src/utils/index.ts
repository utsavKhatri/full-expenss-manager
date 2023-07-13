import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Calculates the percentage change in expenses based on the provided analytics data.
 *
 * @param {object} data - The data object containing the analytics data.
 * @param {array} data.analyticsData - An array of objects representing the analytics data.
 * @param {number} data.analyticsData[].expensePercentageChange - The expense percentage change for an account.
 * @return {string} - The percentage change in expenses as a string rounded to 2 decimal places.
 */
export const getExpensePercentageChange = (
  data: { analyticsData: any[] } | undefined
): string => {
  let expensePercentageChange = 0;
  let length = data?.analyticsData.length;
  data?.analyticsData.map((account: { expensePercentageChange: number }) => {
    expensePercentageChange += account.expensePercentageChange;
  });
  // console.log(expensePercentageChange);
  return (expensePercentageChange / length!).toFixed(2);
};
/**
 * Calculates the percentage change in income based on the analytics data provided.
 *
 * @param {object} data - An object containing the analytics data.
 * @param {array} data.analyticsData - An array of objects representing the analytics data.
 * @param {number} data.analyticsData[].incomePercentageChange - The income percentage change for each account.
 * @return {string} - The calculated income percentage change as a string with two decimal places.
 */
export const getIncomePercentageChange = (
  data: { analyticsData: any[] } | undefined
): string => {
  let incomePercentageChange = 0;
  let length = data?.analyticsData.length;
  data?.analyticsData.map((account: { incomePercentageChange: number }) => {
    incomePercentageChange += account.incomePercentageChange;
  });
  return (incomePercentageChange / length!).toFixed(2);
};

/**
 * Formats a number as a currency string.
 *
 * @param {number} value - The number to format as currency.
 * @param {string} notation - The notation to use for formatting the number.
 *   Possible values are 'standard', 'scientific', 'engineering', 'compact',
 *   or undefined (default is 'compact').
 * @return {string} - The formatted currency string.
 */
export const currencyFormat = (
  value: number,
  notation:
    | 'standard'
    | 'scientific'
    | 'engineering'
    | 'compact'
    | undefined = 'compact'
) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    notation: notation,
  }).format(value);
};

/**
 * Formats a given date string into a localized date and time string.
 *
 * @param {string} date - The date string to be formatted.
 * @return {string} - The formatted date and time string.
 */
export const dateFormater = (date: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(date));
};

/**
 * Fetches data from an API endpoint.
 *
 * @param {Object} options - The options for the API request.
 * @param {string} options.url - The URL of the API endpoint.
 * @param {string} [options.method='GET'] - The HTTP method for the request.
 * @param {any} [options.body] - The request body.
 * @param {boolean} [options.isOpen=false] - Whether the API endpoint is open or requires authentication.
 * @return {Promise<any>} The response data from the API endpoint.
 */
export const fetchAPI = async ({
  url,
  method = 'GET',
  body,
  isOpen = false,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  isOpen?: boolean;
}): Promise<any> => {
  try {
    if (isOpen) {
      const config = {
        method: method,
        data: body,
        url: url,
      };
      const { data } = await axios.request(config);
      return data;
    } else {
      const user = Cookies.get('userInfo');
      const { token } = JSON.parse(user as string);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: method,
        data: body,
        url: url,
      };
      const { data } = await axios.request(config);
      return data;
    }
  } catch (error: any) {
    throw error;
  }
};

export const customThemeData = {
  colors: {
    dark: {
      50: '#f5f5f5',
      100: '#e0e0e0',
      200: '#bdbdbd',
      300: '#9e9e9e',
      400: '#757575',
      500: '#616161',
      600: '#424242',
      700: '#303030',
      800: '#212121',
      900: '#000000', // Pitch black color
    },
    gray: {
      50: '#fafafa',
      100: '#f2f2f2',
      200: '#cccccc',
      300: '#b3b3b3',
      400: '#999999',
      500: '#808080',
      600: '#666666',
      700: '#4d4d4d',
      800: '#333333',
      900: '#0f0f0f', // Darkest shade of black
    },
    amazingLight: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#D3DCE3',
      400: '#A5B4C4',
      500: '#7784A6',
      600: '#657198',
      700: '#4D5A7B',
      800: '#3B4664',
      900: '#29324D',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#0f0f0f', // Set the background color to the custom pitch black color
      },
    },
  },
};

/**
 * Validates if the given email is in a valid format.
 *
 * @param {any} email - The email address to be validated.
 * @return {boolean} Returns true if the email is valid, false otherwise.
 */
export const validateEmail = (email: any): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates the strength of a password.
 *
 * @param {any} password - The password to be validated.
 * @return {boolean} Returns true if the password meets the strength requirements, otherwise returns false.
 */
export const validatePasswordStrength = (password: any): boolean => {
  const minLength = 8;

  // Check for at least one lowercase letter
  const lowercaseRegex = /[a-z]/;
  if (!lowercaseRegex.test(password)) {
    return false;
  }

  // Check for at least one uppercase letter
  const uppercaseRegex = /[A-Z]/;
  if (!uppercaseRegex.test(password)) {
    return false;
  }

  // Check for at least one digit
  const digitRegex = /\d/;
  if (!digitRegex.test(password)) {
    return false;
  }

  // Check for at least one special character
  const specialCharRegex = /[!@#$%^&*]/;
  if (!specialCharRegex.test(password)) {
    return false;
  }

  return password.length >= minLength;
};
