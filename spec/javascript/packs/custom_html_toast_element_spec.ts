import CustomHTMLToastElement from 'packs/custom_html_toast_element';
import html from 'packs/custom_html_toast.html';

customElements.define('test-toast', CustomHTMLToastElement);

describe("class CustomHTMLToastElement", () => {

  test('create', () => {
    const toast = document.createElement('test-toast') as CustomHTMLToastElement;
    expect(toast.shadowRoot.innerHTML).toBe(html);
  });

  test('connectedCallback', () => {
    const toast = document.createElement('test-toast') as CustomHTMLToastElement;
    toast.setAttribute('message', 'connectedCallback');
    toast.setAttribute('message-type', 'info');
    document.body.appendChild(toast);
  });

  test('attributeChangedCallback', () => {
    const toast = document.createElement('test-toast') as CustomHTMLToastElement;
    toast.setAttribute('message', 'connectedCallback');
    toast.setAttribute('message-type', 'info');
    document.body.appendChild(toast);
    toast.setAttribute('message', 'attributeChangedCallback');
    toast.setAttribute('message-type', 'error');
  });

  test('onclick', () => {
    const toast = document.createElement('test-toast') as CustomHTMLToastElement;
    toast.setAttribute('message', 'connectedCallback');
    toast.setAttribute('message-type', 'info');
    document.body.appendChild(toast);
    toast.dispatchEvent(new Event('click'))
  });
});