Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://joelcossins.dev",
            "https://www.joelcossins.dev",
            "http://localhost:4200",
            "http://localhost:3000"

    resource "*",
      headers: :any,
      methods: [:get, :options]
  end
end 