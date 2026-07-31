require_relative "boot"
require "rails/all"

module CarePath
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = true
    config.time_zone = "UTC"
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins ENV.fetch("CORS_ORIGINS", "http://localhost:3000").split(",")
        resource "*", headers: :any, methods: [:get, :post, :put, :patch, :delete, :options]
      end
    end
  end
end
