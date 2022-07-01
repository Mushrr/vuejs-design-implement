export function funcTest(callBack, options) {
    if (options.msg) {
        console.log(options.msg);
    }
    console.time();
    callBack();
    console.timeEnd();
    
}
