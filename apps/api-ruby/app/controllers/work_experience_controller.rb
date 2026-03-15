# frozen_string_literal: true

class WorkExperienceController < ApplicationController
  def index
    experience = resume_service.get_work_experience(resume: resume_param)
    render_envelope(experience)
  end
end