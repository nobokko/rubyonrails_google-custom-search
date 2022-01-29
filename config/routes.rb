Rails.application.routes.draw do
  get 'custom_search/index'
  get 'custom_search', to: 'custom_search#index'
  post 'custom_search/search'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
