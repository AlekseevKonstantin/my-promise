const RESOLVE = 'resolve';
const REJECT = 'reject';
const PENDING = 'pending';
const FINALLY = 'finally';
const ERROR_MSG = 'you have to pass a function';

const isFunction = (fn) => typeof fn === 'function';
 
function callWithCheck(isFunction, callback) {
    if (!isFunction) {
        throw new Error(ERROR_MSG);
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
            isFunction(callback), 
            callback
        )(this.#resolve, this.#reject);
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
    
    #resolve = (value) => {
        queueMicrotask(() => this.#setSubscriber(RESOLVE)(value));
    }

    #reject = (value) => {
        queueMicrotask(() => this.#setSubscriber(REJECT)(value));
    }

    #pushCallback(type, callback) {
        callWithCheck(
            isFunction(callback), 
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
