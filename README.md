### My version of the promise implementation on javascript

> input resolve promise

    console.log('start');

    const promise = new MyPromise((res, rej) => {
        res('resolve');
        console.log('in promise');
    })
    .then((value) => value + ' from then')
    .then((value) => console.log(value + ' promise '))
    .catch((error) => console.error(error))
    .finally(() => console.log('finally'));

    console.log('end');

> output resolve promise

    start
    in promise
    end
    resolve from then  promise 
    finally

---

> input reject promise

    console.log('start');

    const promise = new MyPromise((res, rej) => {
        rej('error');
        console.log('in promise');
    })
    .then((value) => value + ' from then ')
    .then((value) => console.log(value + ' promise '))
    .catch((error) => console.error(error))
    .finally(() => console.log('finally'));

    console.log('end');

> output reject promise

    start
    in promise
    end
    error
    finally
