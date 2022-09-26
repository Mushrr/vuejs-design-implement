// vue 响应式, 对象形式

type AnyFunc = (...args: any[]) => any;
let bucket = new WeakMap(); // 初始化一个仓库

let effectStack: AnyFunc[] = new Array<AnyFunc>();
let activeFunc: AnyFunc;

function reactive(data: object) {
    return new Proxy(data, {
        get(target, p) {
            registry(target, p); // 注册
            // console.log("一个get事件", p, target)
            // console.log(bucket);
            // @ts-ignore
            return target[p];
        },

        set(target, p, newVal) {
            // 触发
            try {
                // console.log("一个set事件", p, target);
                // @ts-ignore
                target[p] = newVal;
                trigger(target, p); // 触发

                return true;
            } catch (e) {
                throw e;
            }
        }
    });
}



// 触发
function trigger(target: object, p: string | symbol) {
    let currBuckets = bucket.get(target); // 获得当前对象的bucket
    let currFuncs = new Set(currBuckets.get(p)) as Set<AnyFunc>; // 任意函数
    // 这里套Set的原因是为了取消对自己的反复调用，
    // new Set之后，遍历的变量将与 new Set没有关系
    // 遍历完毕之后就完成的清理
    // console.log(currFuncs);
    for (let fn of currFuncs) {
        if (fn !== activeFunc) {
            // @ts-ignore
            if (fn.options.scheduler) {
                // @ts-ignore
                fn.options.scheduler(fn);
            } else {
                fn()
            }
        }
    }
}

// 注册
function registry(target: object, p: string | symbol) {
    // 修改之后会
    let currBucket = bucket.get(target);
    if (!currBucket) {
        bucket.set(target, (currBucket = new Map()));
        // 把当前盒子存储起来
    }
    let currFuncs = currBucket.get(p);
    if (!currFuncs) {
        currBucket.set(p, (currFuncs = new Set<AnyFunc>()));
        // 当当前属性没有变量的时候，重新设置一个 set用来
    }
    if (activeFunc) {
        currFuncs.add(activeFunc); // 栈顶元素
        // @ts-ignore
        activeFunc.deps.push(currFuncs); // 把当前函数依赖上函数集合
    } // 把active 函数加进去
}

// 副作用函数
function effect(fn: AnyFunc, options = {}) {
    let curFunc = () => {
        cleanup(curFunc); // 启动curFunc的一瞬间，先清除curFunc的所有依赖
        activeFunc = curFunc;
        effectStack.push(curFunc); // activeFunc 栈
        const res = fn();
        effectStack.pop(); // 函数执行完毕之后弹出
        activeFunc = effectStack[effectStack.length - 1];
        // 弹出之后取下一个元素
        // 保证每次执行的时候都把activeFunc 作为当前函数
        return res; // 返回res
    }

    // @ts-ignore
    curFunc.deps = []; // 设置一个集合用来存放与之关联的函数
    // @ts-ignore
    curFunc.options = options;

    if (!options.lazy) {
        curFunc();
        // 非 lazy情况下执行
    }

    return curFunc;
}

// @ts-ignore
function cleanup(effectFunc) {
    for (let dep of effectFunc.deps) {
        if (dep.has(effectFunc)) {
            dep.delete(effectFunc);
        }
    }
}


function computed(getter) {
    let dirty = true;
    let value;
    const effectFunc = effect(getter, {
        lazy: true,
        scheduler: (fn) => {
            fn();
            dirty = true;
            // 当getter变化的时候，会触发对应的变化，此时直接把dirty 置换为true 即可
            trigger(obj, 'value');
            // 而依赖的响应的时候，又会把这个变化往上抛给 这个计算属性
            // 重复调用之后，就已经得到了最新的数据了
        }
    });
    const obj = {
        get value() {
            if (dirty) {
                dirty = false;
                value = effectFunc();
            }
            registry(obj, 'value'); // 给obj 注册，此时已经有了, 当getter变化的时候主动触发
            // 如果希望computed 也动态更新，那么在这里注册一个obj
            // 其他副作用函数使用了这个计算属性的时候
            // 就会把副作用绑定到这个对象之下
            return value;
        }
    }

    return obj;
}

export {
    effect,
    reactive,
    computed
}
