/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export type ValueOf<T> = T[keyof T];

export const isIncreasingNumber = (num: number) => {
  const numberString = num.toString();
  for (let i = 0; i < numberString.length - 1; i++) {
    if (numberString.charAt(i) > numberString.charAt(i + 1)) {
      return false;
    }
  }
  return true;
};

export const findPana = (value: string) => {
  // Create an object to store digit counts
  const digitCounts = {};

  // Iterate through each digit in the string
  for (const digit of value) {
    // Check if the digit is already present in the object
    if (digitCounts[digit]) {
      digitCounts[digit]++; // Increment the count if found
    } else {
      digitCounts[digit] = 1; // Initialize the count to 1 if not found
    }
  }
  return Math.max(...(Object.values(digitCounts) as number[]));
};
