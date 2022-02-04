import { TypeGoogleApiCustomSearchResultItem } from './custom_search.d';

import CustomHTMLCardElement from './custom_html_card_element';
customElements.define('searchresult-card', CustomHTMLCardElement);

import CustomHTMLToastElement from './custom_html_toast_element';
customElements.define('searchresult-toast', CustomHTMLToastElement);

const button_search = document.getElementById('button_search') as HTMLInputElement;
const loader_container = document.getElementById('loader_container') as HTMLElement;
const keywords_textbox = document.getElementById('keywords_textbox') as HTMLInputElement;
const activatorkey_textbox = document.getElementById('activatorkey_textbox') as HTMLInputElement;
const use_dummy_checkbox = document.getElementById('use_dummy') as HTMLInputElement;
const search_result = document.getElementById('search_result');

/** サーバ問い合わせ時のメソッド */
const method = "POST";
/** サーバ問い合わせ時のヘッダ */
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
};

/**
 * ユーザ操作不可時の制御
 * @param callableFunction ユーザ操作不可中に行う処理
 * @returns プロミス
 */
const loading = (callableFunction: () => Promise<any>) => {
    loader_container.style.display = '';

    return Promise.all([
        callableFunction(),
        new Promise(resolve => setTimeout(resolve, 500)),
    ]).then(([any]) => {
        loader_container.style.display = 'none';
        return any;
    }, ([error]) => {
        loader_container.style.display = 'none';
        return error;
    });
};

/**
 * サーバーへ問い合わせる際のパラメータの作成
 * @param params サーバーへ問い合わせる際のパラメータに関する情報
 * @returns サーバーへ問い合わせる際のパラメータ
 */
const makeFormUrlencodedBody = (params) => Object
    .keys(params)
    .map((key) => key + "=" + encodeURIComponent(params[key]))
    .join("&");

/**
 * サーバーへ問い合わせる
 * @param body サーバーへ問い合わせる際のパラメータ
 * @returns 問い合わせ結果
 */
const fetchJson = (body: string) => loading(() => fetch('/custom_search/search', { method, headers, body, })
    .then(res => {
        console.debug({ res });
        return res.json();
    }));

/**
 * １レコードあたりの結果の表示を行う
 * @param item 検索結果のうちのitemsの各オブジェクト
 * @param timing 表示の遅延時間
 */
const appendSearchResultItem = (item: TypeGoogleApiCustomSearchResultItem, timing: number) => {
    const searchresult_card = document.createElement('searchresult-card') as CustomHTMLCardElement;
    searchresult_card.embedParams(item);
    searchresult_card.removeClassInitialState(timing);
    const li = document.createElement('li');
    li.appendChild(searchresult_card);
    search_result.appendChild(li);
};

/**
 * 結果全体の表示を行う
 * @param json 検索結果
 */
const appendSearchResultList = (json) => {
    let timing = 50;
    for (const item of json?.results?.items as TypeGoogleApiCustomSearchResultItem[]) {
        appendSearchResultItem(item, timing);
        timing += 50;
    }
};

/**
 * 検索結果が最後では無い場合にその続きをサーバーに問い合わせるUIを追加する
 * @param continueListenerFactory 続きをサーバーに問い合わせるUIのクリック時の処理を出力する処理
 * @param json 検索結果
 */
const appendContinueButton = (continueListenerFactory: (continue_button: HTMLElement, json) => (ev) => void, json) => {
    if (json?.results?.queries?.next_page) {
        const li = document.createElement('li');
        li.classList.add('continue_button');
        li.innerText = '続きを読み込む';
        li.addEventListener('click', continueListenerFactory(li, json));
        search_result.appendChild(li);
    }
};

/**
 * サーバーへ問い合わせ～結果の表示まで
 * @param body サーバーへ問い合わせる際のパラメータ
 * @param continueListenerFactory 続きをサーバーに問い合わせるUIのクリック時の処理を出力する処理
 * @returns プロミス
 */
const fetchJsonThenDisplayResult = (body: string, continueListenerFactory: (continue_button: HTMLElement, json) => (ev) => void) => fetchJson(body).then((json) => {
    console.debug({ json });
    if (json?.results?.error) {
        const toast = document.createElement('searchresult-toast') as CustomHTMLToastElement;
        toast.setAttribute('message-type', 'ERROR');
        toast.setAttribute('message', json.results.error);
        document.body.appendChild(toast);
    } else {
        appendSearchResultList(json);
        appendContinueButton(continueListenerFactory, json);
    }
});

//
// 検索ボタン押下時の処理
//
button_search.addEventListener('click', ev => {
    // 情報の固定
    const postParams = {
        keywords: keywords_textbox.value,
        activatorkey: activatorkey_textbox.value,
        usedummy: use_dummy_checkbox.checked,
    };

    // 検索結果のリセット
    search_result.innerHTML = '';

    const continueListenerFactory = (continue_button: HTMLElement, json) => ev => {
        continue_button.parentNode.removeChild(continue_button);

        const body = makeFormUrlencodedBody({ ...postParams, start: json.results.queries.next_page?.[0]?.start_index });

        return fetchJsonThenDisplayResult(body, continueListenerFactory);
    };

    const body = makeFormUrlencodedBody(postParams);

    return fetchJsonThenDisplayResult(body, continueListenerFactory);
});

