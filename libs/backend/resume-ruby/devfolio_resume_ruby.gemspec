# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name    = "devfolio_resume_ruby"
  spec.version = "1.0.0"
  spec.authors = ["Joel Cossins"]
  spec.summary = "Resume domain logic for DevFolio — Ruby implementation"

  spec.required_ruby_version = ">= 3.3.0"

  spec.files = Dir["lib/**/*.rb"]

  spec.add_dependency "pg", "~> 1.5"
end