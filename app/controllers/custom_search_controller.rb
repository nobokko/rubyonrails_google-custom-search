# frozen_string_literal: true

require "google/apis/customsearch_v1"
require "json"

# custom_search
class CustomSearchController < ApplicationController
  protect_from_forgery

  # 一見さんに検索機能は使わせない施策その1 - BASIC認証
  http_basic_authenticate_with name: "admin", password: "admin", except: :index

  def initialize
    super
    # @api_key = Rails.configuration.x.google_apis.customsearch[:api_key]
    @cse_key = Rails.configuration.x.google_apis.customsearch[:cse_key]
    @api_encrypt_iv = Rails.configuration.x.google_apis.customsearch[:api_encrypt_iv]
    @encrypt_api_key = Rails.configuration.x.google_apis.customsearch[:encrypt_api_key]
  end

  # /|/index
  def index; end

  # /search
  def search
    results = if "false".eql?(params[:usedummy])
      api_key = CustomSearchHelper.base64decode_and_decrypt(
        params[:activatorkey],
        @api_encrypt_iv,
        @encrypt_api_key
      )
      search_from_google_apis(api_key, params[:keywords], params[:start])
    else
      search_from_dummy_file("searcher_sample.json")
    end
    render json: { keywords: params[:keywords], activatorkey: params[:activatorkey], usedummy: params[:usedummy],
                   results: results }
  end

  private
    # @param [String] query
    #   Query
    # @param [Fixnum] start
    #   The index of the first result to return. The default number of results per
    #   page is 10, so `&start=11` would start at the top of the second page of
    #   results. **Note**: The JSON API will never return more than 100 results, even
    #   if more than 100 documents match the query, so setting the sum of `start + num`
    #   to a number greater than 100 will produce an error. Also note that the
    #   maximum value for `num` is 10.
    def search_from_google_apis(api_key, query, start = nil)
      searcher = Google::Apis::CustomsearchV1::CustomSearchAPIService.new
      searcher.key = api_key

      result = searcher.list_cses(q: query, cx: @cse_key, start: start, cr: "countryJP", hl: "ja", lr: "lang_ja")
    rescue Google::Apis::RateLimitError => e
      result = { error: e }
    rescue Google::Apis::AuthorizationError => e
      result = { error: e }
    rescue StandardError => e
      result = { error: e }
    ensure
      result
    end

    # get dummy result instead of Google API
    # @param [String] filename
    #   dummy result's file
    def search_from_dummy_file(filename)
      file = File.open(filename)
      JSON.parse(file.read)
    end
end
