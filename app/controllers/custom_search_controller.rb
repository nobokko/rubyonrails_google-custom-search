# frozen_string_literal: true

require 'google/apis/customsearch_v1'

# custom_search
class CustomSearchController < ApplicationController
  protect_from_forgery

  # 一見さんに検索機能は使わせない施策その1 - BASIC認証
  http_basic_authenticate_with name: 'admin', password: 'admin', except: :index

  def index; end

  def search
    render json: { data: 'Hello, World', keywords: params[:keywords], activatorkey: params[:activatorkey] }
  end
end
