# frozen_string_literal: true

class SkillsController < ApplicationController
  def index
    skills = resume_service.get_skills(resume: resume_param)
    render_envelope(skills)
  end
end