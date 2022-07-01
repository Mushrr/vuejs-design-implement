import {funcTest} from './utils/utils.js'

let iters = 10000;

funcTest(() => {
    let array = []
    for(let i = 0; i < iters; i ++) {
        array.push(i);
    }
}, {msg: "原生JS"})

funcTest(() => {
    for (let i = 0; i < iters; i ++) {
        let div = document.createElement('div');
        div.innerText = "Mushroom"
        document.body.appendChild(div);
    }
}, {msg: "DOM"})


funcTest(() => {
    let msg = "<div>Mushroom</div>"
    for (let i = 0; i < iters; i ++) {
       document.innerText += msg;
    }
}, {msg: "RAW"})
