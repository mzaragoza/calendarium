Calendarium::Application.routes.draw do
  devise_for :users, :controllers => {
    registrations: 'users/registrations',
    :sessions => "users/sessions",
    :passwords => 'users/passwords',
    :confirmations => 'users/confirmations'
  }
  authenticate :user do
    namespace :users do
      get '/dashboard' => 'dashboards#index', as: :dashboard
      get '/' => 'dashboards#index'
      root :to => 'dashboards#index'
    end
  end
  devise_for :managers, :controllers => {
    :sessions => "managers/sessions",
    :passwords => 'managers/passwords',
    :confirmations => 'managers/confirmations'
  }

  authenticate :manager do
    namespace :managers do
      resources :managers
      resources :plans
      #resources :accounts
      #resources :admins
      resources :profile, :only => [:edit, :update]
      #mount Resque::Server.new, :at => "/resque"
      get '/dashboard' => 'dashboards#index', as: :dashboard
      get '/' => 'dashboards#index'
      root :to => 'dashboards#index'
    end
  end


  match 'benefits'  => 'pages#benefits' , as: :benefits , via: :all
  match 'features'  => 'pages#features' , as: :features , via: :all
  match 'pricing'   => 'pages#pricing'  , as: :pricing  , via: :all
  match 'ping'      => 'tools#ping'     , as: :ping     , via: :all
  root :to => 'pages#index'
end
