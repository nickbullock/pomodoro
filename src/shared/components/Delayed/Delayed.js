import { useDelayedRender } from "../../hooks/use-delayed-render";

export const Delayed = ({ delay, children }) => useDelayedRender(delay)(() => children);