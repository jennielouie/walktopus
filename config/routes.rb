WalktopusLive::Application.routes.draw do
    root :to => "walks#new"
    get "/walks/search", to: "walks#search"
    resources :comments
    resources :walks
end
