const button_search = document.getElementById('button_search') as HTMLInputElement;
const loader_container = document.getElementById('loader_container') as HTMLElement;
const keywords_textbox = document.getElementById('keywords_textbox') as HTMLInputElement;
const activatorkey_textbox = document.getElementById('activatorkey_textbox') as HTMLInputElement;

button_search.addEventListener('click', ev => {
    loader_container.style.display = '';

    const keywords = keywords_textbox.value;
    const activatorkey = activatorkey_textbox.value;

    const method = "POST";
    const body = ((params) => {
        return Object.keys(params).map((key) => key + "=" + encodeURIComponent(params[key])).join("&");
    })({ keywords, activatorkey, });
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    };
    fetch('/custom_search/search', { method, headers, body, }).then(res => {
        console.log({ res });
        return Promise.all([
            res.json(),
            new Promise(resolve => setTimeout(resolve, 1000)),
        ]);
    }).then(([json]) => {
        console.log({ json });
        const li = document.createElement('li');
        li.innerText = JSON.stringify(json);
        const ul = document.getElementById('search_result');
        // ul.appendChild(li);
        ul.prepend(li);
    }).finally(() => {
        loader_container.style.display = 'none';
    });
});