# frozen_string_literal: true

require_relative "repository"

module DevfolioResumeRuby
  class PostgresRepository < Repository
    def get_profile(resume:)
      row = execute_one(<<~SQL, resume)
        SELECT p.name, p.title, p.clearance, p.summary,
               p.email, p.location, p.github, p.linkedin
        FROM profiles p
        WHERE p.resume_slug = $1
      SQL
      return nil unless row

      Profile.new(
        name:      row["name"],
        title:     row["title"],
        clearance: row["clearance"],
        summary:   row["summary"],
        email:     row["email"],
        location:  row["location"],
        github:    row["github"],
        linkedin:  row["linkedin"]
      )
    end

    def get_work_experience(resume:)
      rows = execute_many(<<~SQL, resume)
        SELECT c.name AS company, c.location,
               r.slug AS role_id, r.title, r.start_date, r.end_date,
               h.body AS highlight, h.sort_order AS highlight_order
        FROM companies c
        JOIN roles r ON r.company_slug = c.slug
        LEFT JOIN highlights h ON h.role_slug = r.slug AND h.resume_slug = $1
        ORDER BY r.sort_order, h.sort_order
      SQL

      group_work_experience(rows)
    end

    def get_education(resume:)
      rows = execute_many(<<~SQL)
        SELECT slug, institution, degree, field, start_date, end_date
        FROM education
        ORDER BY sort_order
      SQL

      rows.map do |row|
        Education.new(
          id:          row["slug"],
          institution: row["institution"],
          degree:      row["degree"],
          field:       row["field"],
          start_date:  row["start_date"],
          end_date:    row["end_date"],
          current:     row["end_date"].nil?
        )
      end
    end

    def get_skills(resume:)
      rows = execute_many(<<~SQL, resume)
        SELECT sc.name AS category, sc.sort_order AS cat_order,
               s.name AS skill_name, s.proficiency,
               s.years_of_experience, s.highlighted, s.sort_order
        FROM skill_categories sc
        JOIN skills s ON s.category_id = sc.id
        WHERE sc.resume_slug = $1
        ORDER BY sc.sort_order, s.sort_order
      SQL

      group_skills(rows)
    end

    def get_projects
      rows = execute_many(<<~SQL)
        SELECT p.slug, p.name, p.description, p.summary,
               p.github_url, p.live_url, p.featured,
               p.start_date, p.current, p.category,
               pt.name AS tech,
               ph.body AS highlight, ph.sort_order AS hl_order
        FROM projects p
        LEFT JOIN project_technologies pt ON pt.project_slug = p.slug
        LEFT JOIN project_highlights ph ON ph.project_slug = p.slug
        ORDER BY p.sort_order, pt.sort_order, ph.sort_order
      SQL

      group_projects(rows)
    end

    def get_database_version
      result = ActiveRecord::Base.connection.execute("SELECT version()")
      result.first["version"]
    rescue StandardError => e
      "Error: #{e.message}"
    end

    def get_database_name
      result = ActiveRecord::Base.connection.execute("SELECT current_database()")
      result.first["current_database"]
    rescue StandardError => e
      "Error: #{e.message}"
    end

    private

    def execute_one(sql, *params)
      execute_many(sql, *params).first
    end

    def execute_many(sql, *params)
      if params.any?
        ActiveRecord::Base.connection.exec_query(sql, "SQL", params).to_a
      else
        ActiveRecord::Base.connection.execute(sql).to_a
      end
    end

    def group_work_experience(rows)
      rows.group_by { |r| r["role_id"] }.map do |_role_id, role_rows|
        first = role_rows.first
        highlights = role_rows
          .select { |r| r["highlight"] }
          .sort_by { |r| r["highlight_order"].to_i }
          .map { |r| r["highlight"] }

        WorkExperience.new(
          id:           first["role_id"],
          company:      first["company"],
          title:        first["title"],
          location:     first["location"],
          start_date:   first["start_date"],
          end_date:     first["end_date"],
          current:      first["end_date"].nil?,
          summary:      "",
          highlights:   highlights,
          technologies: []
        )
      end
    end

    def group_skills(rows)
      rows.group_by { |r| r["category"] }.map do |category, skill_rows|
        SkillCategory.new(
          category: category,
          skills:   skill_rows.map do |r|
            Skill.new(
              name:                r["skill_name"],
              proficiency:         r["proficiency"],
              years_of_experience: r["years_of_experience"],
              highlighted:         r["highlighted"]
            )
          end
        )
      end
    end

    def group_projects(rows)
      rows.group_by { |r| r["slug"] }.map do |_slug, proj_rows|
        first = proj_rows.first
        Project.new(
          id:           first["slug"],
          name:         first["name"],
          description:  first["description"],
          summary:      first["summary"],
          technologies: proj_rows.map { |r| r["tech"] }.compact.uniq,
          github_url:   first["github_url"],
          live_url:     first["live_url"],
          featured:     first["featured"],
          start_date:   first["start_date"],
          current:      first["current"],
          highlights:   proj_rows
            .select { |r| r["highlight"] }
            .sort_by { |r| r["hl_order"].to_i }
            .map { |r| r["highlight"] },
          category:     first["category"]
        )
      end
    end
  end
end