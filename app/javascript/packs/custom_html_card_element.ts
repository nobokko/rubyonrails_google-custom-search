import { TypeGoogleApiCustomSearchResultItem } from './custom_search.d';
import html from './custom_html_card.html';

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
        template.innerHTML = html;

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
