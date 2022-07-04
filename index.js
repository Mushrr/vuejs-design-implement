import { render, ButtonComponent } from './lib/vDom.js'


// const vdom = {
//     tag: 'div',
//     children:
//     [
//         {
//             tag: 'div',
//             children: "X",
//             on: {
//                click: () => {
//                     console.log('HI');
//                } 
//             }
//         },
//         {
//             tag: 'div',
//             children: [
//                 {
//                     tag: 'img',
//                     src: "http://www.mushrain.com/images/John.png",
//                     on: {
//                         click: () => {
//                              document.body.appendChild(
//                                 document.createTextNode("🍎🍎🍎")
//                              );
//                         } 
//                     }
//                 },
//             ]
//         },
//         ButtonComponent()
//     ],
//     props: {
//         style: {
//             backgroundImage: "linear-gradient(#c1b7ff, #b1b1f6)",
//         }
//     }
// }

// let other = {
//     tag: 'div',
//     children: [
//         vdom
//     ]
// }
// render(other, document.body);


// // console.log(document.querySelector('body'))

// // 响应系统

// let main = document.createElement('div');
// main.id = "main";

// document.body.appendChild(main);

// const bucket = new Set(); // 创建一个set

// const data = {text: "Hi I am Mushroom"}



// // 副作用函数 effect();

// const obj = new Proxy(data, {
//     get(target, key) {
//         bucket.add(effect);
//         console.log(key)
//         return target[key]; // 返回数据
//     },
//     set(target, key, newVal) {
//         target[key] = newVal;
//         console.log(target);
//         bucket.forEach(fn => fn());

//         return true;
//     }
// })

// function effect() {
//     document.querySelector('#main').innerHTML = obj.text;
// }

// effect();

// let ele = document.createElement('input');

// ele.type = 'text';

// ele.addEventListener('input', () => {
//     obj.text = ele.value;
// })

// document.body.appendChild(ele);


// 响应式系统

// 使用一个全局变量标记当前响应的函数

let activeEffect;

function effect(fn) {
    activeEffect = fn; // 将当前 activeEffect 转化为 fn

    fn(); // 调用
}


const bocket = new WeakMap(); // 定义一个weakmap 用来存储更新


const textObj = {
    text: "Mushroom",
}

function reactive(obj) {
    // 将传入的obj 转化为响应式, 返回响应式的数据

    return new Proxy(obj, {
        get(target, key) {
            if (!activeEffect) return target[key]; // 如果当前没有任何effect函数，则直接返回

            let attributeMap = bocket.get(target);

            if (!attributeMap) {
                // 如果未定义
                bocket.set(target, (attributeMap = new Map())); // 创建一个新的map
            }

            let keySet = attributeMap.get(key); // 获取key
            if (!keySet) {
                attributeMap.set(key, (keySet = new Set())); // 创建一个新的用来记录数据 set
            }

            keySet.add(activeEffect); // 加入当前的effect 函数

            return target[key];
        },
        set(target, key, newVal) {
            // 当需要设置的时候
            target[key] = newVal; // 不论如何都直接更新

            // 获取当前键下的effect函数
            
            let targetMap = bocket.get(target);
            if (!targetMap) return true;
            let keySet = targetMap.get(key);
            if (!keySet) return true; 
            keySet.forEach(fn => fn());
        }
    })
}







let reactText = reactive(textObj);

const inputTag = {
    tag: 'div',
    children: [
        {
            tag: 'div',
            children: reactText.text,
        },
        {
            tag: 'input',
            props: {
                type: "text"
            },
            on: {
                input: (e) => {
                    reactText.text = e.path[0].value;
                    console.log(reactText.text);
                }
            }
        }
    ]
}

effect(() => {
    render(inputTag, document.body);
})

console.log(activeEffect);
