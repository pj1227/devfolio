# frozen_string_literal: true

require "json"
require_relative "repository"

module DevfolioResumeRuby
  class SeedRepository < Repository
    def initialize
      @data = load_data
    end

    def get_profile(resume:)
      base    = @data["base"]["profile"]
      variant = @data["resumes"][resume]&.dig("profile") || {}
      Profile.new(
        name:      base["name"],
        title:     base["title"],
        clearance: base["clearance"],
        summary:   variant["summary"] || "",
        email:     base["email"],
        location:  base["location"],
        github:    base["github"],
        linkedin:  base["linkedin"]
      )
    end

    def get_work_experience(resume:)
      @data["base"]["workExperience"].map do |entry|
        variant_highlights = @data["resumes"][resume]&.dig("highlights") || {}
        base_highlights    = entry.dig("highlights", "base") || {}

        entry["roles"].map do |role|
          highlights = variant_highlights[role["id"]] ||
                       base_highlights[role["id"]] || []
          WorkExperience.new(
            id:           role["id"],
            company:      entry["company"],
            title:        role["title"],
            location:     entry["location"],
            start_date:   role["startDate"],
            end_date:     role["endDate"],
            current:      role["endDate"].nil?,
            summary:      "",
            highlights:   highlights,
            technologies: []
          )
        end
      end.flatten
    end

    def get_education(resume:)
      @data["base"]["education"].map do |edu|
        Education.new(
          id:          edu["id"],
          institution: edu["institution"],
          degree:      edu["degree"],
          field:       edu["field"],
          start_date:  edu["startDate"],
          end_date:    edu["endDate"],
          current:     edu["endDate"].nil?
        )
      end
    end

    def get_skills(resume:)
      (@data["resumes"][resume]&.dig("skills") || []).map do |cat|
        SkillCategory.new(
          category: cat["category"],
          skills:   cat["skills"].map do |s|
            Skill.new(
              name:                s["name"],
              proficiency:         "intermediate",
              years_of_experience: nil,
              highlighted:         false
            )
          end
        )
      end
    end

    def get_projects
      []
    end

    def get_database_version
      "None (seed mode — no database connected)"
    end

    def get_database_name
      "None (seed mode)"
    end

    private

    def load_data
      path = File.expand_path("../../../../data/resumes.json", __dir__)
      JSON.parse(File.read(path))
    end
  end
end