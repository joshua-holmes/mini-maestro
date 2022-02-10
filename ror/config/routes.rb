Rails.application.routes.draw do
  namespace :api do
    resources :tunes, only: [:create, :destroy, :update]
    resources :users, only: [:create]
    get "/me", to: "users#show"
    post "/login", to: "sessions#create"
    delete "/logout", to: "sessions#destroy"
  end
  

  get "*path", to: "fallback#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
