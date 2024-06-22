// Functions for Indian Numbering System
function formatNum(number: number) {
  let num1 = Math.floor(number / 1000).toString();
  let num2 = number.toString().slice(-3);

  if (num1 == "0") {
    return num2;
  }

  if (num1.length < 3) {
    return num1 + "," + num2;
  }

  if (num1.length >= 3) {
    num1 = num1.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  }

  return num1 + "," + num2;
}

const BASE62_CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE62_LENGTH = BASE62_CHARACTERS.length;

// Function to encode a number to Base62
function base62Encode(num: number) {
  let base62 = "";
  while (num > 0) {
    base62 = BASE62_CHARACTERS[num % BASE62_LENGTH] + base62;
    num = Math.floor(num / BASE62_LENGTH);
  }
  return base62;
}

// Function to decode a Base62 string to a number
function base62Decode(base62Str: string) {
  let num = 0;
  for (let char of base62Str) {
    num = num * BASE62_LENGTH + BASE62_CHARACTERS.indexOf(char);
  }
  return num;
}

// Function to convert a string to a number
function stringToNumber(str: string) {
  return str.split("").reduce((num, char) => num * 256 + char.charCodeAt(0), 0);
}

// Function to convert a number back to a string
function numberToString(num: number) {
  let chars = [];
  while (num > 0) {
    chars.push(String.fromCharCode(num % 256));
    num = Math.floor(num / 256);
  }
  return chars.reverse().join("");
}

// Function to generate a UID from _id
function generateUID(_id: string) {
  const num = stringToNumber(_id);
  return base62Encode(num);
}

// Function to retrieve the original _id from UID
function retrieveID(uid: string) {
  const num = base62Decode(uid);
  return numberToString(num);
}

export { formatNum, generateUID, retrieveID };
