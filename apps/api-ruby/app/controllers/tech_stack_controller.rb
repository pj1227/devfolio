# frozen_string_literal: true

class TechStackController < ApplicationController
  def show
    tech_stack = resume_service.get_tech_stack
    render_envelope(tech_stack)
  end
end