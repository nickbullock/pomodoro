import { useState, useEffect, useRef } from 'react';

export function useAnimationTimerOnDidUpdate(duration = 1000, delay = 0, deps = []) {
    const [elapsed, setTime] = useState(0);
    const mountedRef = useRef(false);

    useEffect(
        () => {
            let animationFrame, timerStop, start, timerDelay;

            function onFrame() {
                const newElapsed = Date.now() - start;

                setTime(newElapsed);
                if (newElapsed >= duration) {
                    return;
                }
                loop();
            }

            function loop() {
                animationFrame = requestAnimationFrame(onFrame);
            }

            function onStart() {
                start = Date.now();
                loop();
            }

            if (mountedRef.current) {
                timerDelay = delay > 0 ? setTimeout(onStart, delay) : onStart();
            } else {
                mountedRef.current = true;
            }

            return () => {
                clearTimeout(timerStop);
                clearTimeout(timerDelay);
                cancelAnimationFrame(animationFrame);
                setTime(0);
            };
        },
        [duration, delay, ...deps]
    );

    return elapsed;
}
