import { useAnimationTimerOnDidUpdate } from './use-animation-timer';
import { round } from '../utils';

export function useAnimationOnDidUpdate(
  easingName = 'linear',
  duration = 500,
  delay = 0,
  deps = []
) {
  const elapsed = useAnimationTimerOnDidUpdate(duration, delay, deps);
  const n = Math.min(1, elapsed / duration);

  return round(easing[easingName](n));
}

// https://github.com/streamich/ts-easing/blob/master/src/index.ts
const easing = {
  linear: n => n,
  elastic: n =>
    n * (33 * n * n * n * n - 106 * n * n * n + 126 * n * n - 67 * n + 15),
  inExpo: n => Math.pow(2, 10 * (n - 1)),
  inOutCubic: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  inOutQuart: (t) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  inOutQuad: (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  inOutQuint: (t) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  inOutCirc: (t) => {
    t /= .5;
    if (t < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
    t -= 2;
    return (Math.sqrt(1 - t * t) + 1) / 2;
  }
};
