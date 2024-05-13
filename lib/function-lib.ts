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

export { formatNum };
