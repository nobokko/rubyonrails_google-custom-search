import { TypeGoogleApiCustomSearchResultItem } from './custom_search.d';

/**
 * 検索結果Webコンポーネント
 */
export default class CustomHTMLCardElement extends HTMLElement {
    /**
     * コンストラクタ
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(this.template());
    }

    /**
     * テンプレート
     * @returns テンプレート
     */
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

    /**
     * 検索結果の埋め込み
     * @param params 検索結果情報
     */
    embedParams(params: TypeGoogleApiCustomSearchResultItem) {
        const tag_card__root = this.shadowRoot.querySelector('.card')! as HTMLAnchorElement;
        tag_card__root.href = params.link;

        const tag_card__titletext = this.shadowRoot.querySelector('.card__titletext')! as HTMLElement;
        tag_card__titletext.innerHTML = params.html_title ?? 'No title';

        const tag_card__overviewtext = this.shadowRoot.querySelector('.card__overviewtext')! as HTMLElement;
        tag_card__overviewtext.innerHTML = params.html_snippet ?? 'No detail.';

        const tag_card__imgframe = this.shadowRoot.querySelector('.card__imgframe')! as HTMLDivElement;
        const cse_image_0_src = params?.pagemap?.cse_image?.[0]?.src;
        tag_card__imgframe.innerHTML = '';
        if (cse_image_0_src) {
            const img = document.createElement('img') as HTMLImageElement;
            img.src = cse_image_0_src;
            tag_card__imgframe.appendChild(img);
        } else {
            tag_card__imgframe.innerText = 'No image'
        }
    }

    /**
     * initial-state クラスを取り除く
     * @param ms 取り除くまでの時間（ミリ秒）
     */
    removeClassInitialState(ms: number) {
        const tag_card__root = this.shadowRoot.querySelector('.card')! as HTMLAnchorElement;
        setTimeout(() => {
            tag_card__root.classList.remove('initial-state');
        }, ms);
    }
}
