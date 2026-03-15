# frozen_string_literal: true

module DevfolioResumeRuby
  # Plain Ruby structs — like Pydantic models but without validation.
  # Validation happens at the API layer via Rails.

  Profile = Struct.new(
    :name, :title, :clearance, :summary,
    :email, :location, :github, :linkedin,
    keyword_init: true
  )

  WorkExperience = Struct.new(
    :id, :company, :title, :location,
    :start_date, :end_date, :current,
    :summary, :highlights, :technologies,
    keyword_init: true
  )

  Education = Struct.new(
    :id, :institution, :degree, :field,
    :start_date, :end_date, :current,
    keyword_init: true
  )

  Skill = Struct.new(
    :name, :proficiency, :years_of_experience, :highlighted,
    keyword_init: true
  )

  SkillCategory = Struct.new(:category, :skills, keyword_init: true)

  Project = Struct.new(
    :id, :name, :description, :summary,
    :technologies, :github_url, :live_url,
    :featured, :start_date, :current,
    :highlights, :category,
    keyword_init: true
  )

  RuntimeInfo = Struct.new(:name, :version, :implementation, keyword_init: true)
  FrameworkInfo = Struct.new(:name, :version, :extra, keyword_init: true)
  DatabaseInfo = Struct.new(:name, :version, :dialect, :connected, keyword_init: true)
  OsInfo = Struct.new(:platform, :release, :architecture, keyword_init: true)
  EnvironmentInfo = Struct.new(:name, :timezone, keyword_init: true)
  PackageInfo = Struct.new(:name, :version, :category, keyword_init: true)

  TechStackInfo = Struct.new(
    :generated_at, :runtime, :framework, :database,
    :os, :environment, :packages,
    keyword_init: true
  )
end