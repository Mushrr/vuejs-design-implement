import { render, ButtonComponent } from './lib/vDom.js'


const vdom = {
    tag: 'div',
    children:
    [
        {
            tag: 'div',
            children: "X",
            on: {
               click: () => {
                    console.log('HI');
               } 
            }
        },
        {
            tag: 'div',
            children: [
                {
                    tag: 'img',
                    src: "http://www.mushrain.com/images/John.png",
                    on: {
                        click: () => {
                             document.body.appendChild(
                                document.createTextNode("🍎🍎🍎")
                             );
                        } 
                    }
                },
            ]
        },
        ButtonComponent()
    ],
    props: {
        style: {
            backgroundImage: "linear-gradient(#c1b7ff, #b1b1f6)",
        }
    }
}

let other = {
    tag: 'div',
    children: [
        vdom
    ]
}
render(other, document.body);


// console.log(document.querySelector('body'))
