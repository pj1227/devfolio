# frozen_string_literal: true

class ProjectsController < ApplicationController
  def index
    projects = resume_service.get_projects
    render_envelope(projects)
  end
end