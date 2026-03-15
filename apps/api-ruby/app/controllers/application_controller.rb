# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ResumeServiceInitializer

  def resume_param
    params[:resume] || "fullstack"
  end

  def render_envelope(data)
    render json: { data: data, version: "1.0" }
  end
end