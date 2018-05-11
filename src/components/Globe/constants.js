import {Vector3} from 'three';

export const GLOBE_RADIUS = 200;
export const GLOBE_CENTER = new Vector3(0, 0, 0);

export const PI_TWO = Math.PI * 2;
export const PI_HALF = Math.PI / 2;

export const CURVE_SEGMENTS = 32;
export const CURVE_MIN_ALTITUDE = 20;
export const CURVE_MAX_ALTITUDE = 200;
export const colors = [
  0x38acc6, // Blue
  0xd79f2e, // Mustard
  0xb74ea3, // Purple
  0xc2401f, // Red
  0xfa8613, // Orange
  0x40ad81, // Green
];

export const magazines = [
  {slug: 'mireya', name: 'Mireya', key: 'Mireya'},
  {slug: 'af', name: 'Agitación Femenina', key: 'AF'},
  {slug: 'mf', name: 'Mundo Femenino', key: 'MF'},
  {slug: 'verdad', name: 'Verdad', key: 'Verdad'},
  {slug: 'contrastes', name: 'Constrastes', key: 'Contrastes'},
  {slug: 'mujer', name: 'Mujer', key: 'Mujer'}
];
