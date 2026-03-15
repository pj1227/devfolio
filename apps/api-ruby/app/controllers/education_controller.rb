# frozen_string_literal: true

class EducationController < ApplicationController
  def index
    education = resume_service.get_education(resume: resume_param)
    render_envelope(education)
  end
end