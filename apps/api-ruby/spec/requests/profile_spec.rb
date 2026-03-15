# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Profile", type: :request do
  describe "GET /profile" do
    it "returns 200 with profile data for fullstack resume" do
      get "/profile", params: { resume: "fullstack" }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["data"]["name"]).to eq("Joel M. Cossins")
      expect(json["data"]["title"]).to eq("Software Developer")
    end

    it "returns 200 with profile data for dotnet resume" do
      get "/profile", params: { resume: "dotnet" }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["data"]["name"]).to eq("Joel M. Cossins")
    end

    it "defaults to fullstack when no resume param given" do
      get "/profile"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["data"]).to include("name", "title", "summary")
    end
  end
end