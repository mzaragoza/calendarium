Calendarium::Application.routes.draw do

  match 'ping'  => 'tools#ping', as: :ping, via: :all
  root :to => 'pages#index'
end
