# frozen_string_literal: true

require "rbconfig"
require "json"

module DevfolioResumeRuby
  class Service
    def initialize(repository)
      @repo = repository
    end

    def get_profile(resume:)
      @repo.get_profile(resume: resume)
    end

    def get_work_experience(resume:)
      @repo.get_work_experience(resume: resume)
    end

    def get_education(resume:)
      @repo.get_education(resume: resume)
    end

    def get_skills(resume:)
      @repo.get_skills(resume: resume)
    end

    def get_projects
      @repo.get_projects
    end

    def get_tech_stack
      db_version   = @repo.get_database_version
      db_name      = @repo.get_database_name
      db_connected = !db_version.downcase.include?("seed mode")

      TechStackInfo.new(
        generated_at: Time.now.utc.iso8601,
        runtime: RuntimeInfo.new(
          name:           "Ruby",
          version:        RUBY_VERSION,
          implementation: defined?(RUBY_ENGINE) ? RUBY_ENGINE : "ruby"
        ),
        framework: FrameworkInfo.new(
          name:    "Rails",
          version: Rails::VERSION::STRING,
          extra:   {
            "puma"   => gem_version("puma"),
            "pg"     => gem_version("pg")
          }
        ),
        database: DatabaseInfo.new(
          name:      db_name,
          version:   db_version,
          dialect:   "postgres",
          connected: db_connected
        ),
        os: OsInfo.new(
          platform:     RbConfig::CONFIG["host_os"],
          release:      `uname -r`.strip,
          architecture: RbConfig::CONFIG["host_cpu"]
        ),
        environment: EnvironmentInfo.new(
          name:     Rails.env,
          timezone: "UTC"
        ),
        packages: [
          PackageInfo.new(name: "rails",  version: Rails::VERSION::STRING, category: "framework"),
          PackageInfo.new(name: "puma",   version: gem_version("puma"),    category: "server"),
          PackageInfo.new(name: "pg",     version: gem_version("pg"),      category: "database"),
          PackageInfo.new(name: "rack",   version: gem_version("rack"),    category: "middleware")
        ]
      )
    end

    private

    def gem_version(name)
      Gem.loaded_specs[name]&.version&.to_s || "unknown"
    end
  end
end