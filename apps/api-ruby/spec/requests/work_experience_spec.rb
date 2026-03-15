# frozen_string_literal: true

require "rails_helper"

RSpec.describe "WorkExperience", type: :request do
  describe "GET /work-experience" do
    it "returns 200 with an array of work experience" do
      get "/work-experience", params: { resume: "fullstack" }
      expect(response).to have_http_status(:ok)
      expect(json_response["data"]).to be_an(Array)
      expect(json_response["data"].length).to be > 0
    end

    it "returns company and title for each entry" do
      get "/work-experience", params: { resume: "fullstack" }
      first = json_response["data"].first
      expect(first).to include("company", "title", "highlights")
    end

    it "returns highlights as an array" do
      get "/work-experience", params: { resume: "fullstack" }
      json_response["data"].each do |entry|
        expect(entry["highlights"]).to be_an(Array)
      end
    end
  end
end