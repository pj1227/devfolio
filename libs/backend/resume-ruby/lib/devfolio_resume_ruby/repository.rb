# frozen_string_literal: true

module DevfolioResumeRuby
  # Abstract repository interface.
  # Ruby doesn't have formal interfaces like TypeScript or abstract classes
  # like Python's ABC — convention is to define the interface by raising
  # NotImplementedError in each method. Subclasses override them.
  class Repository
    def get_profile(resume:)
      raise NotImplementedError, "#{self.class}#get_profile not implemented"
    end

    def get_work_experience(resume:)
      raise NotImplementedError, "#{self.class}#get_work_experience not implemented"
    end

    def get_education(resume:)
      raise NotImplementedError, "#{self.class}#get_education not implemented"
    end

    def get_skills(resume:)
      raise NotImplementedError, "#{self.class}#get_skills not implemented"
    end

    def get_projects
      raise NotImplementedError, "#{self.class}#get_projects not implemented"
    end

    def get_database_version
      raise NotImplementedError, "#{self.class}#get_database_version not implemented"
    end

    def get_database_name
      raise NotImplementedError, "#{self.class}#get_database_name not implemented"
    end
  end
end