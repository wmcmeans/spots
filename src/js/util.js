import { COLORS_ARRAY } from './constants';

export const queryEl = selector => (document.querySelector(selector));
export const queryElAll = selector => (document.querySelectorAll(selector));

export const randomColor = () => {
  const idx = Math.floor(Math.random() * 5);
  return COLORS_ARRAY[idx];
};

export const getOppositeDelta = (delta) => {
  switch (delta) {
    case 'top':
      return 'bottom';
    case 'right':
      return 'left';
    case 'bottom':
      return 'top';
    case 'left':
      return 'right';
    default:
      throw new Error('delta not found in list of deltas');
  }
};

export const fixCanvasBlur = (canvas) => {
  const context = canvas.getContext('2d');
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1;

  const ratio = devicePixelRatio / backingStoreRatio;

  if (devicePixelRatio !== backingStoreRatio) {
    let oldWidth = canvas.width;
    let oldHeight = canvas.height;

    if (canvas.width > (window.innerWidth * 1.1)) {
      const shrinkToFitScreenRatio = window.innerWidth / (canvas.width * 1.1);
      oldWidth *= shrinkToFitScreenRatio;
      oldHeight *= shrinkToFitScreenRatio;
    } else if (canvas.height > window.innerHeight * 1.1) {
      const shrinkToFitScreenRatio = window.innerHeight / (canvas.height * 1.1);
      oldWidth *= shrinkToFitScreenRatio;
      oldHeight *= shrinkToFitScreenRatio;
    }

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = `${oldWidth}px`;
    canvas.style.height = `${oldHeight}px`;

    context.scale(ratio, ratio);
  }
};

export const getCursorPos = (canvas, event) => {
  event.preventDefault();
  event.stopPropagation();

  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  return { x, y };
};

export const getTouchPos = (canvas, event) => {
  event.preventDefault();
  event.stopPropagation();

  const touch = event.touches[0] || event.changedTouches[0];
  const x = touch.clientX - canvas.offsetLeft;
  const y = touch.clientY - canvas.offsetTop;

  return { x, y };
};

export const getColorAtReducedOpacity = (color, opacity = 0.5) => {
  const opacityIdx = color.length - 2;
  return `${color.slice(0, opacityIdx)}${opacity})`;
};
