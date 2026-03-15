# frozen_string_literal: true

require "devfolio_resume_ruby"

module ResumeServiceInitializer
  def resume_service
    @resume_service ||= begin
      repo = if ENV["DATABASE_URL"].present?
        r = DevfolioResumeRuby::PostgresRepository.new
        begin
          DevfolioResumeRuby::Seeder.new.seed
        rescue StandardError => e
          Rails.logger.warn "Seeder failed: #{e.message}"
        end
        r
      else
        DevfolioResumeRuby::SeedRepository.new
      end
      DevfolioResumeRuby::Service.new(repo)
    end
  end
end