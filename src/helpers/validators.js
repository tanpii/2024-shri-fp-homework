/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { allPass, anyPass, complement, compose, curry, equals, prop, values  } from "ramda";

// Предикаты для цветов
const isColor = curry((color, value) => equals(color, value));
const isWhite = isColor('white');
const isRed = isColor('red');
const isGreen = isColor('green');
const isBlue = isColor('blue');
const isOrange = isColor('orange');

// Геттеры для получения фигуры
const getStar = prop('star');
const getCircle = prop('circle');
const getSquare = prop('square');
const getTriangle = prop('triangle');

// Предикаты для фигур по цветам
const isWhiteTriangle = compose(isWhite, getTriangle);
const isGreenTriangle = compose(isGreen, getTriangle);
const isNotWhiteTriangle = compose(complement(isWhite), getTriangle);
const isWhiteCircle = compose(isWhite, getCircle);
const isBlueCircle = compose(isBlue, getCircle);
const isRedStar = compose(isRed, getStar);
const isNotRedStar = compose(complement(isRed), getStar);
const isNotWhiteStar = compose(complement(isWhite), getStar);
const isGreenSquare = compose(isGreen, getSquare);
const isOrangeSquare = compose(isOrange, getSquare);
const isNotWhiteSquare = compose(complement(isWhite), getSquare);

// Счетчики и связанные с ними функции
const countShapesByColor = curry((color, shapes) =>
    shapes.reduce((count, shape) => 
        (isColor(color)(shape) ? count + 1 : count), 0)
);
const isCountMoreThan = curry((countFunc, count, shapes) => 
    countFunc(shapes) >= count
);
const isCountEqual = curry((countFunc, count, shapes) =>
    countFunc(shapes) === count
);
const isCountsEqual = curry((countFunc1, countFunc2, shapes) =>
    countFunc1(shapes) === countFunc2(shapes)
);

const countGreenShapes = countShapesByColor('green');
const countBlueShapes = countShapesByColor('blue');
const countRedShapes = countShapesByColor('red');
const countOrangeShapes = countShapesByColor('orange');

const countGreenShapesMoreThan3 = compose(
    isCountMoreThan(countShapesByColor('green'), 3),
    values
);
const countBlueShapesMoreThan3 = compose(
    isCountMoreThan(countShapesByColor('blue'), 3),
    values
);
const countRedShapesMoreThan3 = compose(
    isCountMoreThan(countShapesByColor('red'), 3),
    values
);
const countOrangeShapesMoreThan3 = compose(
    isCountMoreThan(countShapesByColor('orange'), 3),
    values
);

// Валидаторы
const isWhiteTriangleAndWhiteCircle = allPass([isWhiteTriangle, isWhiteCircle]);
const isRedStarAndGreenSquare = allPass([isRedStar, isGreenSquare]);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    isWhiteTriangleAndWhiteCircle,
    isRedStarAndGreenSquare
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(
    isCountMoreThan(countGreenShapes, 2),
    values
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(
    isCountsEqual(countRedShapes, countBlueShapes),
    values
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    isBlueCircle,
    isRedStar,
    isOrangeSquare
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
    countGreenShapesMoreThan3,
    countBlueShapesMoreThan3,
    countRedShapesMoreThan3,
    countOrangeShapesMoreThan3
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    compose(isCountEqual(countGreenShapes, 2), values),
    isGreenTriangle,
    compose(isCountMoreThan(countRedShapes, 1), values)
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(
    isCountEqual(countOrangeShapes, 4),
    values
);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
    isNotRedStar,
    isNotWhiteStar
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(
    isCountEqual(countGreenShapes, 4),
    values
);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    isNotWhiteSquare,
    isNotWhiteTriangle,
    compose(
        (shapes) => isColor(getSquare(shapes))(getTriangle(shapes)),
        values
    )
]);
