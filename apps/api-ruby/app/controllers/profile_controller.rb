# frozen_string_literal: true

class ProfileController < ApplicationController
  def show
    profile = resume_service.get_profile(resume: resume_param)
    render_envelope(profile)
  end
end