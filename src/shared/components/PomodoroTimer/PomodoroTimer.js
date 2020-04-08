import React, { useRef, useEffect, useState, useCallback } from 'react';
import './PomodoroTimer.scss';
import { WaterDrop } from './WaterDrop';
import { Button } from '../Button';
import { POMODORO_STATE, POMODORO_BG, DEFAULT_DURATION } from '../../constants';
import { Delayed } from '../Delayed';
import Icon16Cancel from '@vkontakte/icons/dist/16/cancel';

const STATE = POMODORO_STATE;
const TICKS = 24;
const REST_TICKS = 16;
const DROP_WIDTH = 12 + 'px';
const DROP_HEIGHT = 12 + 'px';
const OFFSET = 20;

const DEFAULT_TIME = '25:00';
const DEFAULT_POMODORO_TIME = 25 * 60;

const REST_DEFAULT_TIME = '05:00';
const REST_DEFAULT_POMODORO_TIME = 5 * 60;

export const PomodoroTimer = ({ onBGChange, isCollapsed, setTimerState, timerState, activeTodo, dropActiveTodo }) => {
    const [size, setSize] = useState(0);
    const [ticks, setTicks] = useState(TICKS);
    const [formattedTime, setFormattedTime] = useState(DEFAULT_TIME);
    const angle = 360 / ticks;
    const intervalRef = useRef(null);
    const previusTimeRef = useRef(null);

    const endTimer = useCallback(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, []);
    const handleSetTime = useCallback(({ formattedTime, remainingTime }) => {
        if (remainingTime <= 0) {
            const nextState = timerState === STATE.STARTED ? STATE.REST_STOPPED : STATE.STOPPED;

            setTimerState(nextState);

            return;
        }
        setFormattedTime(formattedTime);
    }, [timerState]);
    const handleTimerState = useCallback(e => {
        const state = e.target.dataset.state;

        setTimerState(state);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const globalWidth = document.body.clientWidth;
            const globalHeight = document.body.clientHeight;
            const size = Math.min(globalWidth, globalHeight);
            const multiplier = globalWidth < globalHeight ? 0.9 : 0.65;
            const actualSize = Math.floor(multiplier * size);

            setSize(actualSize);
        }, 100)
    }, []);

    useEffect(() => {
        switch (timerState) {
            case STATE.STARTED:
                intervalRef.current = startTimer(previusTimeRef.current || DEFAULT_POMODORO_TIME, handleSetTime);
                previusTimeRef.current = null;
                break;
            case STATE.STOPPED:
                onBGChange(POMODORO_BG.RED);
                endTimer();
                setTicks(TICKS);
                setFormattedTime(DEFAULT_TIME);
                previusTimeRef.current = null;
                break;
            case STATE.PAUSED:
                endTimer();
                const prevTime = formattedTime.split(':').map(str => +str);
                previusTimeRef.current = prevTime[0] * 60 + prevTime[1];
                break;
            case STATE.REST_STOPPED:
                onBGChange(POMODORO_BG.BLUE);
                endTimer();
                setTicks(REST_TICKS);
                setFormattedTime(REST_DEFAULT_TIME);
                previusTimeRef.current = null;
                break;
            case STATE.REST_STARTED:
                intervalRef.current = startTimer(previusTimeRef.current || REST_DEFAULT_POMODORO_TIME, handleSetTime);
                previusTimeRef.current = null;
                break;
            default:
                break;
        }
    }, [timerState]);

    return (
        <>
            {isCollapsed && <>
                <Delayed delay={DEFAULT_DURATION}>
                    {formattedTime.split(':')[0]}
                </Delayed>
            </>}
            {!isCollapsed && <>
                <Delayed delay={DEFAULT_DURATION}>
                    {activeTodo && <div className="pomodoro-timer__todo">
                        <div className="pomodoro-timer__todo-item">{activeTodo.title}</div>
                        <Icon16Cancel className="pomodoro-timer__todo-cancel" onClick={dropActiveTodo} />
                    </div>}
                    <div className="pomodoro-timer" style={{ width: size + 'px', height: size + 'px' }}>
                        <div className="pomodoro-timer__time">
                            {formattedTime}
                        </div>
                        <svg className="pomodoro-timer__svg">
                            {Array.from(Array(ticks)).map((_, index) => {
                                const fid = index * angle;
                                const fir = fid * Math.PI / 180;
                                const rot = fid - 90;
                                const r = size / 2 - OFFSET;
                                const o = OFFSET / 2;
                                const x = Math.round(r + r * Math.cos(fir) + o);
                                const y = Math.round(r + r * Math.sin(fir) + o);

                                return (
                                    <g key={index} transform={`translate(${x}, ${y}) rotate(${0})`} transform-origin={'0px 0px'}>
                                        <WaterDrop width={DROP_WIDTH} height={DROP_HEIGHT}></WaterDrop>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                    <div className="pomodoro-timer__buttons">
                        {timerState !== STATE.STARTED && timerState !== STATE.REST_STARTED && <Button className='pomodoro-timer__button' onClick={handleTimerState} data-state={timerState === STATE.STOPPED || timerState === STATE.PAUSED ? STATE.STARTED : STATE.REST_STARTED}>Старт</Button>}
                        {timerState === STATE.STARTED && <Button className='pomodoro-timer__button' onClick={handleTimerState} data-state={STATE.PAUSED}>Пауза</Button>}
                        {timerState === STATE.PAUSED && <Button className='pomodoro-timer__button' onClick={handleTimerState} data-state={STATE.STOPPED}>Стоп</Button>}
                        {timerState === STATE.REST_STARTED && <Button className='pomodoro-timer__button' onClick={handleTimerState} data-state={STATE.STOPPED} style={{ fontSize: 14 }}>Закончить</Button>}
                    </div>
                </Delayed>
            </>}
        </>
    );
};

function startTimer(duration, callback) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        diff = duration - (((Date.now() - start) / 1000) | 0);

        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        callback({ remainingTime: diff, formattedTime: minutes + ":" + seconds });

        if (diff <= 0) {
            start = Date.now() + 1000;
        }
    };
    timer();

    return setInterval(timer, 1000);
}