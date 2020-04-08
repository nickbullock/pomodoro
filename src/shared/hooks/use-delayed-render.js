import { useEffect, useState } from 'react';

export const useDelayedRender = delay => {
    const [delayed, setDelayed] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setDelayed(false), delay);

        return () => clearTimeout(timeout);
    }, [delay]);

    return fn => !delayed && fn();
};