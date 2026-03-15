# frozen_string_literal: true

require "json"
require "active_record"

module DevfolioResumeRuby
  class Seeder
    SKILL_META = {
      "angular"              => ["expert",   10, true],
      "react"                => ["advanced",  3, true],
      "vue/nuxt"             => ["advanced",  2, false],
      "typescript"           => ["expert",    8, true],
      "javascript"           => ["expert",   12, false],
      "html"                 => ["expert",   15, false],
      "css"                  => ["expert",   15, false],
      "c#"                   => ["expert",   10, true],
      ".net"                 => ["expert",   10, true],
      ".net core"            => ["expert",   10, true],
      "sql server"           => ["expert",   10, true],
      "entity framework"     => ["expert",    8, false],
      "git"                  => ["expert",   10, false],
      "github"               => ["expert",   10, false],
      "unit testing"         => ["expert",    8, false],
      "ai-assisted development workflows (aidd)" => ["advanced", 2, true]
    }.freeze

    def initialize(connection = ActiveRecord::Base.connection)
      @conn = connection
    end

    def seed
      data     = load_data
      base     = data["base"]
      variants = data["resumes"]
      meta     = data["meta"]

      seed_resumes(meta)
      seed_profiles(base, variants)
      seed_companies_and_roles(base, variants, meta)
      seed_education(base)
      seed_skills(variants)
      seed_projects

      Rails.logger.info "Seeding complete ✓" if defined?(Rails)
    end

    private

    def load_data
      path = File.expand_path("../../../../data/resumes.json", __dir__)
      JSON.parse(File.read(path))
    end

    def skill_meta(name)
      SKILL_META[name.downcase] || ["intermediate", nil, false]
    end

    def upsert(table, conflict_column, values)
      columns = values.keys.join(", ")
      placeholders = values.keys.each_with_index.map { |k, i| "$#{i + 1}" }.join(", ")
      updates = values.keys
        .reject { |k| k.to_s == conflict_column.to_s }
        .map { |k| "#{k} = EXCLUDED.#{k}" }
        .join(", ")

      sql = <<~SQL
        INSERT INTO #{table} (#{columns})
        VALUES (#{placeholders})
        ON CONFLICT (#{conflict_column}) DO UPDATE SET #{updates}
      SQL

      @conn.exec_query(sql, "SQL", values.values.map(&:to_s))
    end

    def seed_resumes(meta)
      meta["resumes"].each do |slug|
        label      = { "fullstack" => "Full Stack", "dotnet" => ".NET" }[slug] || slug
        is_default = slug == meta["defaultResume"]
        upsert(:resumes, :slug, { slug: slug, label: label, is_default: is_default })
      end
    end

    def seed_profiles(base, variants)
      bp = base["profile"]
      variants.each do |slug, variant|
        vp = variant["profile"] || {}
        upsert(:profiles, :resume_slug, {
          resume_slug: slug,
          name:        bp["name"],
          title:       bp["title"],
          clearance:   bp["clearance"],
          summary:     vp["summary"] || "",
          email:       bp["email"],
          location:    bp["location"],
          github:      bp["github"],
          linkedin:    bp["linkedin"]
        })
      end
    end

    def seed_companies_and_roles(base, variants, meta)
      base["workExperience"].each do |entry|
        upsert(:companies, :slug, {
          slug:     entry["id"],
          name:     entry["company"],
          location: entry["location"]
        })

        entry["roles"].each_with_index do |role, order|
          upsert(:roles, :slug, {
            slug:         role["id"],
            company_slug: entry["id"],
            title:        role["title"],
            start_date:   role["startDate"],
            end_date:     role["endDate"],
            sort_order:   order
          })

          base_hl = entry.dig("highlights", "base") || {}
          if base_hl[role["id"]]
            meta["resumes"].each do |resume_slug|
              upsert_highlights(role["id"], resume_slug, base_hl[role["id"]])
            end
          end
        end

        variants.each do |resume_slug, variant|
          variant_hl = variant["highlights"] || {}
          entry["roles"].each do |role|
            next unless variant_hl[role["id"]]
            upsert_highlights(role["id"], resume_slug, variant_hl[role["id"]])
          end
        end
      end
    end

    def upsert_highlights(role_slug, resume_slug, highlights)
      @conn.execute(
        "DELETE FROM highlights WHERE role_slug='#{role_slug}' AND resume_slug='#{resume_slug}'"
      )
      highlights.each_with_index do |body, i|
        @conn.exec_query(
          "INSERT INTO highlights (role_slug, resume_slug, body, sort_order) VALUES ($1,$2,$3,$4)",
          "SQL", [role_slug, resume_slug, body, i]
        )
      end
    end

    def seed_education(base)
      base["education"].each_with_index do |edu, i|
        upsert(:education, :slug, {
          slug:        edu["id"],
          institution: edu["institution"],
          degree:      edu["degree"],
          field:       edu["field"],
          start_date:  edu["startDate"],
          end_date:    edu["endDate"],
          sort_order:  i
        })
      end
    end

    def seed_skills(variants)
      variants.each do |resume_slug, variant|
        (variant["skills"] || []).each_with_index do |cat, cat_order|
          cat_id = @conn.exec_query(<<~SQL, "SQL", [resume_slug, cat["category"], cat_order]).first&.dig("id")
            INSERT INTO skill_categories (resume_slug, name, sort_order)
            VALUES ($1, $2, $3)
            ON CONFLICT (resume_slug, name) DO UPDATE SET sort_order = EXCLUDED.sort_order
            RETURNING id
          SQL

          @conn.execute("DELETE FROM skills WHERE category_id = #{cat_id}")
          cat["skills"].each_with_index do |skill, skill_order|
            proficiency, years, highlighted = skill_meta(skill["name"])
            @conn.exec_query(
              "INSERT INTO skills (category_id, name, proficiency, years_of_experience, highlighted, sort_order) VALUES ($1,$2,$3,$4,$5,$6)",
              "SQL", [cat_id, skill["name"], proficiency, years, highlighted, skill_order]
            )
          end
        end
      end
    end

    def seed_projects
      projects = [
        {
          slug: "proj-001", name: "DevFolio",
          description: "This portfolio — a polyglot full stack architecture demo",
          summary: "A developer portfolio serving the same resume data from multiple frontend frameworks and backend languages.",
          github_url: "https://github.com/pj1227/devfolio",
          featured: true, start_date: "2025-08", current: true, category: "web",
          technologies: ["Next.js", "React", "TypeScript", "FastAPI", "Rails", "PostgreSQL"],
          highlights: [
            "Shared TypeScript interfaces enforce one contract across all frontends and backends",
            "Live /api/tech-stack endpoint proves each implementation is real",
            "TDD from the start — tests written before implementation"
          ]
        },
        {
          slug: "proj-002", name: "WPF Weather or Not",
          description: "WPF desktop weather app in C# / .NET",
          summary: "A WPF desktop application demonstrating MVVM patterns with live weather data.",
          github_url: "https://github.com/pj1227/WPF-Weather-or-Not",
          featured: true, start_date: "2025-08", current: false, category: "other",
          technologies: ["C#", ".NET", "WPF", "XAML", "MVVM"],
          highlights: [
            "MVVM architecture with clean separation of concerns",
            "Live weather API integration via C# HttpClient"
          ]
        }
      ]

      projects.each_with_index do |proj, i|
        upsert(:projects, :slug, {
          slug:        proj[:slug],
          name:        proj[:name],
          description: proj[:description],
          summary:     proj[:summary],
          github_url:  proj[:github_url],
          live_url:    nil,
          featured:    proj[:featured],
          start_date:  proj[:start_date],
          current:     proj[:current],
          category:    proj[:category],
          sort_order:  i
        })

        @conn.execute("DELETE FROM project_technologies WHERE project_slug = '#{proj[:slug]}'")
        proj[:technologies].each_with_index do |tech, j|
          @conn.exec_query(
            "INSERT INTO project_technologies (project_slug, name, sort_order) VALUES ($1,$2,$3)",
            "SQL", [proj[:slug], tech, j]
          )
        end

        @conn.execute("DELETE FROM project_highlights WHERE project_slug = '#{proj[:slug]}'")
        proj[:highlights].each_with_index do |hl, j|
          @conn.exec_query(
            "INSERT INTO project_highlights (project_slug, body, sort_order) VALUES ($1,$2,$3)",
            "SQL", [proj[:slug], hl, j]
          )
        end
      end
    end
  end
end