import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Delayed } from '../Delayed';
import './Pomodoro.scss';
import { useAnimationOnDidUpdate } from '../../hooks/use-animation';
import { PomodoroTimer } from '../PomodoroTimer';
import { clamp, round } from '../../utils';
import cs from 'classnames';
import { POMODORO_BG, POMODORO_MODE, DEFAULT_DURATION } from '../../constants';
import { Arrow } from './Arrow';
import { useOnDidUpdate } from '../../hooks/use-on-did-update';

const DEFAULT_SIZE = 70;
const DEFAULT_BORDER = 50;
const DEFAULT_BOTTOM = 15;
const noop = () => { };

export const Pomodoro = ({ mode, onClick, timerState, setTimerState, activeTodo, dropActiveTodo }) => {
    const [bg, setBG] = useState(POMODORO_BG.RED);
    const pomodoroRef = useRef(null);
    const fullWidthRef = useRef(null);
    const fullHeight = useRef(null);
    const widthdRef = useRef(null);
    const heightRef = useRef(null);
    const borderRadiusRef = useRef(null);
    const bottomRef = useRef(null);
    const isCollapsed = mode === POMODORO_MODE.COLLAPSED;

    const animation = useAnimationOnDidUpdate('inOutQuint', DEFAULT_DURATION, 0, [mode]);
    const multiplier = useMemo(() => round(isCollapsed ? 1 - animation : animation), [isCollapsed, animation]);

    useEffect(() => {
        setTimeout(() => {
            fullWidthRef.current = pomodoroRef.current.parentElement.clientWidth;
            fullHeight.current = pomodoroRef.current.parentElement.clientHeight;
        }, 100);
    }, []);

    const { newWidth, newHeight, newRadius, newBottom } = useMemo(() => {
        let newWidth, newHeight, newRadius, newBottom;
        let minBorder = 0;

        newWidth = clamp(DEFAULT_SIZE + multiplier * fullWidthRef.current, DEFAULT_SIZE, fullWidthRef.current) + 'px';
        newHeight = clamp(DEFAULT_SIZE + multiplier * fullHeight.current, DEFAULT_SIZE, fullHeight.current) + 'px';
        newRadius = clamp(round(DEFAULT_BORDER - DEFAULT_BORDER * multiplier * 5), minBorder, DEFAULT_BORDER) + '%';
        newBottom = clamp(round(DEFAULT_BOTTOM - DEFAULT_BOTTOM * multiplier), 0, DEFAULT_BOTTOM) + '%';

        if (multiplier > 0.15 && multiplier < 0.95) {
            newRadius = '30px'
        }

        return { newWidth, newHeight, newRadius, newBottom };
    }, [multiplier]);

    useOnDidUpdate(() => {
        widthdRef.current = newWidth;
        heightRef.current = newHeight;
        borderRadiusRef.current = newRadius;
        bottomRef.current = newBottom;
    }, [multiplier]);

    const styles = { width: widthdRef.current, height: heightRef.current, borderRadius: borderRadiusRef.current, bottom: bottomRef.current };

    return (
        <div ref={pomodoroRef}
            style={styles}
            className={cs('pomodoro', `pomodoro_${bg}`, !isCollapsed)}
            onClick={isCollapsed ? onClick : noop}>
            {!isCollapsed && <>
                <Delayed delay={DEFAULT_DURATION}>
                    <div className='pomodoro__arrow' onClick={onClick}>
                        <Arrow width={16} height={16} />
                    </div>
                </Delayed>
            </>}
            <PomodoroTimer isCollapsed={isCollapsed} onBGChange={setBG} timerState={timerState} setTimerState={setTimerState} activeTodo={activeTodo} dropActiveTodo={dropActiveTodo} />
        </div>
    );
};