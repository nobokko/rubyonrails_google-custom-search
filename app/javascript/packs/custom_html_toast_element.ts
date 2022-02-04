/**
 * トーストWebコンポーネント
 */
export default class CustomHTMLToastElement extends HTMLElement {
    /**
     * テンプレート
     * @returns テンプレート
     */
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(this.template());

        const root = this.shadowRoot.getElementById('root');
        this.addEventListener('click', ev => {
            root.style.height = '0';
            root.style.overflow = 'hidden';

            root.addEventListener('transitionend', ev => {
                this.parentNode.removeChild(this);
            }, { once: true });

        }, { once: true });
    }

    /**
     * テンプレート
     * @returns テンプレート
     */
    template() {
        const template = document.createElement('template');
        template.innerHTML = `
        <style>
        #root {
            position: fixed;
            width: 100%;
            top:50%;
            left:0;
            transform: translate(0, -50%);
            transition: 0.5s;
        }
        #root.error {
            background: red;
        }
        #root.info {
            background: green;
        }
        </style>
        <div id="root" class="error">
            <div id="messsage"></div>
        </div>
        `;

        return template.content;
    }

    static get observedAttributes() {
        return [
            'message',
            'message-type',
        ];
    }
    connectedCallback() {
        const root = this.shadowRoot.getElementById('root');
        const height = root.offsetHeight;

        root.style.overflow = 'hidden';
        root.style.height = '0';
        setTimeout(() => {
            root.style.height = `${height}px`;
        }, 50);

        for (const attrname of CustomHTMLToastElement.observedAttributes) {
            switch (attrname.toLowerCase()) {
                case 'message':
                    {
                        this.shadowRoot.getElementById('messsage').innerText = this.getAttribute(attrname);
                    }
                    break;
                case 'message-type':
                    {
                        const root = this.shadowRoot.getElementById('root');
                        root.classList.remove('error', 'info');
                        root.classList.add(this.getAttribute(attrname).toLowerCase());
                    }
                    break;
            }
        }
        setTimeout(() => {
            this.dispatchEvent(new Event('click'));
        }, 3000);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name.toLowerCase()) {
            case 'message':
                {
                    this.shadowRoot.getElementById('messsage').innerText = newValue;
                }
                break;
            case 'message-type':
                {
                    const root = this.shadowRoot.getElementById('root');
                    root.classList.remove('error', 'info');
                    root.classList.add(newValue.toLowerCase());
                }
                break;
        }
    }
}
