const loggerMiddleware = store => next => action => {
    if (process.env.NODE_ENV === 'development') {
        console.log('%c[Redux] Action Dispatched:', 'color: #00f; font-weight: bold;', action);
        console.log('%c[Redux] Previous State:', 'color: #888;', store.getState());
    }

    const result = next(action);  // Dispatch the action

    if (process.env.NODE_ENV === 'development') {
        console.log('%c[Redux] Next State:', 'color: #080;', store.getState());
    }

    return result;
};

export default loggerMiddleware;
