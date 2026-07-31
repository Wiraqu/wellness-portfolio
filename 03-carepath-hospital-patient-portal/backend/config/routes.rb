Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "auth/login", to: "auth#login"
      post "auth/register", to: "auth#register"
      get "auth/me", to: "auth#me"

      resources :patients do
        resources :admissions, only: [:index, :create]
        resources :vital_signs, only: [:index, :create]
        resources :medications, only: [:index, :create, :update]
        resources :documents, only: [:index, :create]
        resources :care_plans, only: [:index, :create, :update]
      end

      resources :admissions, only: [:show, :update, :destroy] do
        member do
          post "discharge"
          post "transfer"
        end
      end

      resources :appointments
      get "dashboard/metrics", to: "dashboard#metrics"
      get "dashboard/occupancy", to: "dashboard#occupancy"
      get "fhir/patient/:id", to: "fhir#patient"
      get "fhir/observation/:id", to: "fhir#observation"
    end
  end
  get "health", to: proc { [200, {}, [{ status: "ok" }.to_json]] }
end
