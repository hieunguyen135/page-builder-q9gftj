export const MAX_COLUMN = 3;

export const POSITION = {
  TOP: 1,
  RIGHT: 2,
  BOTTOM: 3,
  LEFT: 4,
  CENTER: 5
};

export const ORIENTATION = {
  COLUMN: 1,
  ROW: 2
};

export const UTILITY = {
  GENERATE_KEY: (pre = 0) => {
    return `${pre}_${new Date().getTime()}`;
  }
};

export const DRAG_AND_DROP_TYPE = {
  TITLE: 'TITLE',
  DESCRIPTION: 'DESCRIPTION',
  GALLERY: 'GALLERY',
  SPACER: 'SPACER',
};