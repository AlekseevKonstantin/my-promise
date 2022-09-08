const RESOLVE = 'resolve';
const REJECT = 'reject';
const PENDING = 'pending';
const FINALLY = 'finally';

const ERROR_MSG = 'you have to pass a function';

const isFunction = (fn) => typeof fn === 'function';
const checkCallback = (callback) => () => isFunction(callback); 
 
function callWithCheck(check, errorMsg, callback) {

    if (!check()) {
        throw new Error(errorMsg);
    }

    return (...args) => callback.apply(this, args);
}

class MyPromise {
    #state = PENDING;
    #value = null;
    #callbacks = {
        [RESOLVE]: [],
        [REJECT]: [],
        [FINALLY]: [],
    };

    constructor(callback) {
        callWithCheck(
            checkCallback(callback), 
            ERROR_MSG,
            callback
        )(this.#resolve, this.#reject);
    }

    #resolve = (value) => {
        queueMicrotask(() => this.#setSubscriber(RESOLVE)(value));
    }

    #reject = (value) => {
        queueMicrotask(() => this.#setSubscriber(REJECT)(value));
    }

    #setSubscriber(state) {
        return (value) => {
            this.#state = state;
            this.#value = value;
    
            const callbacks = [...this.#callbacks[this.#state], ...this.#callbacks[FINALLY]];
    
            callbacks.forEach((callback) => {
                queueMicrotask(() => {
                    this.#value = callback.call(this, this.#value)
                });
            });
        }
    }

    #pushCallback(type, callback) {
        callWithCheck(
            checkCallback(callback), 
            ERROR_MSG,
            () => this.#callbacks[type].push(callback)
        )();
    }

    then(callback) {
        this.#pushCallback(RESOLVE, callback);
        return this;
    }

    catch(callback) {
        if (this.#callbacks[REJECT].length === 0) {
            this.#pushCallback(REJECT, callback);
        }
        return this;
    }

    finally(callback) {
        this.#pushCallback(FINALLY, callback);
        return this;
    }
}
