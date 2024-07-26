/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import { allPass, compose, gt, __, tap, test, length } from 'ramda';
import Api from '../tools/api';

const api = new Api();

const isLengthLessThan10 = compose(gt(10), length);
const isLengthGreaterThan2 = compose(gt(__, 2), length);
const isPositive = compose(gt(__, 0), Number);
const isValidChars = test(/^[0-9.]+$/);

const validateString = allPass([
    isLengthLessThan10,
    isLengthGreaterThan2,
    isPositive,
    isValidChars
]);

const toNumber = compose(Math.round, parseFloat);

const square = x => x * x;
const remainderBy3 = x => x % 3;

const getBinary = (number) =>
    api.get('https://api.tech/numbers/base', { from: 10, to: 2, number })
        .then(({ result }) => result);

const getRandomAnimal = (id) =>
    api.get(`https://animals.tech/${id}`, {})
        .then(({ result }) => result);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    writeLog(value);

    if (!validateString(value)) {
        handleError('ValidationError');
        return;
    }

    const number = toNumber(value);

    getBinary(number)
        .then(compose(
            getRandomAnimal,
            tap(writeLog),
            remainderBy3,
            tap(writeLog),
            square,
            tap(writeLog),
            length,
            tap(writeLog),
        ))
        .then(animal => {
            handleSuccess(animal);
        })
        .catch(error => handleError(`API Error: ${error}`));
};

export default processSequence;
