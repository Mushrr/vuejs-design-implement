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
//                                 document.createTextNode("ððð")
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

// // ååºç³»ç»

// let main = document.createElement('div');
// main.id = "main";

// document.body.appendChild(main);

// const bucket = new Set(); // åå»ºä¸ä¸ªset

// const data = {text: "Hi I am Mushroom"}



// // å¯ä½ç¨å½æ° effect();

// const obj = new Proxy(data, {
//     get(target, key) {
//         bucket.add(effect);
//         console.log(key)
//         return target[key]; // è¿åæ°æ®
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


// ååºå¼ç³»ç»

// ä½¿ç¨ä¸ä¸ªå¨å±åéæ è®°å½åååºçå½æ°

let activeEffect;

function effect(fn) {
    activeEffect = fn; // å°å½å activeEffect è½¬åä¸º fn

    fn(); // è°ç¨
}


const bocket = new WeakMap(); // å®ä¹ä¸ä¸ªweakmap ç¨æ¥å­å¨æ´æ°


const textObj = {
    text: "Mushroom",
}

function reactive(obj) {
    // å°ä¼ å¥çobj è½¬åä¸ºååºå¼, è¿åååºå¼çæ°æ®

    return new Proxy(obj, {
        get(target, key) {
            if (!activeEffect) return target[key]; // å¦æå½åæ²¡æä»»ä½effectå½æ°ï¼åç´æ¥è¿å

            let attributeMap = bocket.get(target);

            if (!attributeMap) {
                // å¦ææªå®ä¹
                bocket.set(target, (attributeMap = new Map())); // åå»ºä¸ä¸ªæ°çmap
            }

            let keySet = attributeMap.get(key); // è·åkey
            if (!keySet) {
                attributeMap.set(key, (keySet = new Set())); // åå»ºä¸ä¸ªæ°çç¨æ¥è®°å½æ°æ® set
            }

            keySet.add(activeEffect); // å å¥å½åçeffect å½æ°

            return target[key];
        },
        set(target, key, newVal) {
            // å½éè¦è®¾ç½®çæ¶å
            target[key] = newVal; // ä¸è®ºå¦ä½é½ç´æ¥æ´æ°

            // è·åå½åé®ä¸çeffectå½æ°
            
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
