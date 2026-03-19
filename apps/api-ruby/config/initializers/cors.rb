Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://joelcossins.dev",
            "https://www.joelcossins.dev",
            "http://localhost:4200",  # local dev (Docker / primary Nx serve)
            "http://localhost:4201",  # local dev (Nx serve when 4200 is occupied)
            "http://localhost:3000"   # future Next.js dev

    resource "*",
      headers: :any,
      methods: [:get, :options]
  end
end