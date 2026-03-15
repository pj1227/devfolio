# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Projects", type: :request do
  describe "GET /projects" do
    it "returns 200 with an array of projects" do
      get "/projects"
      expect(response).to have_http_status(:ok)
      expect(json_response["data"]).to be_an(Array)
    end

    it "returns required fields for each project" do
      get "/projects"
      json_response["data"].each do |proj|
        expect(proj).to include("name", "description", "technologies")
      end
    end
  end
end