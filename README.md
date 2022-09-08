### My version of the promise implementation on javascript

> input

    console.log('start');

    const promise = new MyPromise((res, rej) => {
        rej('error');
        console.log('in promise');
    })
    .then((value) => value + ' from then ')
    .then((value) => console.log(value + ' promise '))
    .catch((error) => console.error(error))
    .finally(() => console.log('finally-1'))
    .finally(() => console.log('finally-2'));

    console.log('end');

> output

    start
    in promise
    end
    error
    finally-1
    finally-2