export function render(VDom, root) {
    console.log(VDom);
    const el = document.createElement(VDom.tag);
    let child;
    if (VDom.tag === 'img') {
        el.src = VDom.src;
    }
    if (VDom.on) {
        for (let [key, fun] of Object.entries(VDom.on)) {
            el.addEventListener(key, fun);
        }
    }
    if (VDom.props) {
        for (let [key, val] of Object.entries(VDom.props)) {
            if (key === "style") {
                for (let [st, value] of Object.entries(VDom.props.style)) {
                    el.style[st] = value;
                }
            }
        }
    }
    if (typeof VDom.children === "string") {
        child = document.createTextNode(VDom.children);
        el.appendChild(child); 
    } else if (VDom.children) {
        VDom.children.forEach((vdom) => {
            render(vdom, el);
        })
    }
    root.appendChild(el);
}

let height = 100;

function redsQuare() {
    return {
        tag: 'div',
        props: {
            style: {
                height: `${height}px`,
                width: `${height}px`,
                backgroundImage: 'linear-gradient(#19fffb, #18d4ff)',
            }
        }
    }
}

export function ButtonComponent() {
    return {
        tag: 'button',
        on: {
            click: (e) => {
                render(redsQuare(), document.body);
            } 
        },
        children: "Click"
    }
}
