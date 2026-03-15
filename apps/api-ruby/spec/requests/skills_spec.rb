# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Skills", type: :request do
  describe "GET /skills" do
    it "returns 200 with an array of skill categories" do
      get "/skills", params: { resume: "fullstack" }
      expect(response).to have_http_status(:ok)
      expect(json_response["data"]).to be_an(Array)
      expect(json_response["data"].length).to be > 0
    end

    it "returns category name and skills array for each entry" do
      get "/skills", params: { resume: "fullstack" }
      json_response["data"].each do |cat|
        expect(cat).to include("category", "skills")
        expect(cat["skills"]).to be_an(Array)
      end
    end

    it "returns proficiency for each skill" do
      get "/skills", params: { resume: "fullstack" }
      json_response["data"].first["skills"].each do |skill|
        expect(skill).to include("name", "proficiency")
      end
    end
  end
end