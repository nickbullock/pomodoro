export const POMODORO_BG = {
    RED: 'red',
    BLUE: 'blue'
};

export const POMODORO_STATE = {
    STARTED: 'STARTED',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED',
    REST_STOPPED: 'REST_STOPPED',
    REST_STARTED: 'REST_STARTED'
};

export const POMODORO_MODE = {
    FULL: 'full',
    COLLAPSED: 'COLLAPSED'
}

export const STORY = {
    MAIN: 'MAIN',
    STATS: 'STATS',
    SETTINGS: 'SETTINGS'
}
export const STATE = {
    [STORY.MAIN]: {
        GROUPS: 'GROUPS',
        TODOS: 'TODOS',
        EDIT_MODAL: 'EDIT_MODAL'
    },
    [STORY.STATS]: {},
    [STORY.SETTINGS]: {}
};

export const DEFAULT_DURATION = 200;

export const TOKEN = "22d4bbf322d4bbf322d4bbf3b022a4244f222d422d4bbf37c5475c419edf1e93a686e6f";