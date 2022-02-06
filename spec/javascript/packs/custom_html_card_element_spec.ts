import CustomHTMLCardElement from 'packs/custom_html_card_element';
import html from 'packs/custom_html_card.html';
import { TypeGoogleApiCustomSearchResultItem } from 'packs/custom_search.d';

customElements.define('test-card', CustomHTMLCardElement);

describe("class CustomHTMLCardElement", () => {

  test('create', () => {
    const card = document.createElement('test-card') as CustomHTMLCardElement;
    expect(card.shadowRoot.innerHTML).toBe(html);
  });

  test('embedParams', () => {
    const card = document.createElement('test-card') as CustomHTMLCardElement;

    card.embedParams({});
    expect(card.shadowRoot.innerHTML).not.toBe(html);

    card.embedParams({
      pagemap: {
        cse_image: [
          { src: "https://example.com/", }
        ],
      },
      html_title: 'html_title',
      html_snippet: 'html_snippet',
    });
    expect(card.shadowRoot.innerHTML).not.toBe(html);
  });

  test('removeClassInitialState', done => {
    const card = document.createElement('test-card') as CustomHTMLCardElement;
    card.removeClassInitialState(50).then(done);
  });
});