# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Education", type: :request do
  describe "GET /education" do
    it "returns 200 with an array of education" do
      get "/education", params: { resume: "fullstack" }
      expect(response).to have_http_status(:ok)
      expect(json_response["data"]).to be_an(Array)
    end

    it "returns institution, degree and field for each entry" do
      get "/education", params: { resume: "fullstack" }
      json_response["data"].each do |entry|
        expect(entry).to include("institution", "degree", "field")
      end
    end
  end
end