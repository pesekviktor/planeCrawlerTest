export const getHasMine = (maxSum: number) => (x: number, y: number): boolean => {
    return calculateDigitSum(x) + calculateDigitSum(y) > maxSum;
}

const calculateDigitSum = (number: number): number => {
    const strNumber = number.toString();
    let sum = 0;
    let index;
    for (index = 0; index < strNumber.length; index++) {
        sum += Number(strNumber[index]);
    }
    return sum;
}
