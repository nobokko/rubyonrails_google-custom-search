require 'rails_helper'

RSpec.describe 'CustomSearches', type: :request do
  # include Rails.application.routes.url_helpers
  describe 'GET /index' do
    context 'as first access' do
      it 'works!' do
        get custom_search_index_path
        expect(response).to have_http_status(200)
        expect(response).to be_successful
      end
    end
  end

  describe 'POST /search' do
    context 'as search API' do
      it 'not works!(basic auth)' do
        post custom_search_search_path
        expect(response).to have_http_status(:unauthorized)
        expect(response).not_to be_successful
      end

      let(:authheaders) {
        { "Authorization" => 'Basic YWRtaW46YWRtaW4=',}
      }

      it 'works!()' do
        post custom_search_search_path , params: {}, headers: authheaders
        expect(response).to have_http_status(200)
        expect(response).to be_successful
        body_json = JSON.parse(response.body)
        expect(body_json['keywords']).to eq(nil)
        expect(body_json['activatorkey']).to eq(nil)
        expect(body_json['usedummy']).to eq(nil)
        expect(body_json['results']).to_not eq(nil)
        results_json = body_json['results']
        expected_results_json = JSON.parse(File.open('searcher_sample.json').read)
        expect(results_json).to eq(expected_results_json)
      end
    end
  end
end
