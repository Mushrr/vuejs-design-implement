import {reactive, effect, computed} from "./react";


const data = reactive({
    val: 1
})

let jobSet = new Set();

let isFlush = false;
let p = Promise.resolve();
function flush() {
    if (isFlush) return;
    isFlush = true;
    p.then(() => {
        for (let func of jobSet) {
            func()
        }
    }).finally(() => {
        isFlush = false;
    })
}

effect(() => {
    console.log(data.val)
}, {
    scheduler: (fn) => {
        jobSet.add(fn);
        flush();
        // 因为传入的是同一个函数所以去重了，只执行了一次
    }
})

const aa = computed(() => data.val + 1);

const appElement = document.querySelector('#app');
const button = document.querySelector('#button');

button.addEventListener('click', (e) => {
    data.val += 1;
    // 此时触发 -> 依赖的计算属性触发 -> 触发effect
})

effect(() => {
    appElement.innerHTML = aa.value;
    // 计算副作用函数
})




