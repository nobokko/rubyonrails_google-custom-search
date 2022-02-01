const button_search = document.getElementById('button_search') as HTMLInputElement;
const loader_container = document.getElementById('loader_container') as HTMLElement;
const keywords_textbox = document.getElementById('keywords_textbox') as HTMLInputElement;
const activatorkey_textbox = document.getElementById('activatorkey_textbox') as HTMLInputElement;
const use_dummy_checkbox = document.getElementById('use_dummy') as HTMLInputElement;

button_search.addEventListener('click', ev => {
    loader_container.style.display = '';

    const keywords = keywords_textbox.value;
    const activatorkey = activatorkey_textbox.value;
    const usedummy = use_dummy_checkbox.checked;

    const method = "POST";
    const body = ((params) => {
        return Object.keys(params).map((key) => key + "=" + encodeURIComponent(params[key])).join("&");
    })({ keywords, activatorkey, usedummy, });
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    };
    const ul = document.getElementById('search_result');
    ul.innerHTML = '';
    fetch('/custom_search/search', { method, headers, body, }).then(res => {
        console.log({ res });
        return Promise.all([
            res.json(),
            new Promise(resolve => setTimeout(resolve, 1000)),
        ]);
    }).then(([json]) => {
        console.log({ json });
        let timing = 50;
        for (const item of json?.results?.items as TypeGoogleApiCustomSearchResultItem[]) {
            const searchresult_card = document.createElement('searchresult-card') as CustomHTMLCardElement;
            // searchresult_card.innerText = JSON.stringify(json);
            searchresult_card.embedParams(item);
            searchresult_card.removeClassInitialState(timing);
            const li = document.createElement('li');
            li.appendChild(searchresult_card);
            ul.appendChild(li);
            // ul.prepend(li);
            timing += 50;
        }
    }).finally(() => {
        loader_container.style.display = 'none';
    });
});

type TypeGoogleApiCustomSearchResultItem = ({
    pagemap?: {
        [key: string]: ({
            [key: string]: string
        }[])
    }
} & {
    [key: string]: string
})

class CustomHTMLCardElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(this.template());
    }

    template() {
        const template = document.createElement('template');
        template.innerHTML = `
        <style>
        .card{
            display: flex;
            flex-direction: column-reverse;
            width: 288px;
            max-height: 66vh;
            min-height: 33vh;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,.2);
            transform: scale(1);
            transition: 0.5s;
        }
        .card.initial-state{
            transform: scale(0);
        }
        .card__imgframe{
            width: 100%;
            height: auto;
            background: #fff;
            box-sizing: border-box;
            display: flex;
            align-content: center;
            justify-content: center;
        }
        .card__imgframe img{
            max-width: 100%;
            max-height: 100%;
        }
        .card__textbox{
            width: 100%;
            height: auto;
            padding: 20px 18px;
            background: #fff;
            box-sizing: border-box;
        }
        .card__textbox > * + *{
            margin-top: 10px;
        }
        .card__titletext{
            display: inline-block;
            font-size: 20px;
            font-weight: bold;
            line-height: 125%;
        }
        .card__overviewtext{
            font-size: 12px;
            line-height: 150%;
        }
        </style>
        <a class="card initial-state">
            <div class="card__textbox">
                <div class="card__titletext">
                    タイトルがはいります。
                </div>
                <div class="card__overviewtext">
                    概要がはいります。
                </div>
            </div>
            <div class="card__imgframe">
                画像がはいります。
            </div>
        </a>
        `;

        return template.content;
    }

    embedParams(params: TypeGoogleApiCustomSearchResultItem) {
        const tag_card__root = this.shadowRoot.querySelector('.card')! as HTMLAnchorElement;
        tag_card__root.href = params.link;

        const tag_card__titletext = this.shadowRoot.querySelector('.card__titletext')!;
        tag_card__titletext.innerHTML = params.html_title;

        const tag_card__overviewtext = this.shadowRoot.querySelector('.card__overviewtext')!;
        tag_card__overviewtext.innerHTML = params.html_snippet;

        const tag_card__imgframe = this.shadowRoot.querySelector('.card__imgframe')! as HTMLDivElement;
        const cse_image_0_src = params?.pagemap.cse_image?.[0]?.src;
        tag_card__imgframe.innerHTML = '';
        if (cse_image_0_src) {
            const img = document.createElement('img') as HTMLImageElement;
            img.src = cse_image_0_src;
            tag_card__imgframe.appendChild(img);
        } else {
            tag_card__imgframe.innerText = 'No image'
        }
    }

    removeClassInitialState(ms: number) {
        const tag_card__root = this.shadowRoot.querySelector('.card')! as HTMLAnchorElement;
        setTimeout(() => {
            tag_card__root.classList.remove('initial-state');
        }, ms);
    }
}
customElements.define('searchresult-card', CustomHTMLCardElement);

