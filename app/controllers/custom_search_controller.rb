# frozen_string_literal: true

require 'google/apis/customsearch_v1'
require 'json'

# custom_search
class CustomSearchController < ApplicationController
  protect_from_forgery

  # 一見さんに検索機能は使わせない施策その1 - BASIC認証
  http_basic_authenticate_with name: 'admin', password: 'admin', except: :index

  def initialize
    super
    @api_key = Rails.configuration.x.google_apis.customsearch[:api_key]
    @cse_key = Rails.configuration.x.google_apis.customsearch[:cse_key]
  end

  def index; end

  def search
    if 'false'.eql?(params[:usedummy])
      results = search_from_google_apis(params[:keywords])
    else
      file = File.open('searcher_sample.json')
      results = JSON.parse(file.read)
    end
    render json: { keywords: params[:keywords], activatorkey: params[:activatorkey], usedummy: params[:usedummy],
                   results: results }
  end

  private

  def search_from_google_apis(query)
    searcher = Google::Apis::CustomsearchV1::CustomSearchAPIService.new
    searcher.key = @api_key

    searcher.list_cses(q: query, cx: @cse_key)
  end
end
