# frozen_string_literal: true

require "rails_helper"

RSpec.describe "TechStack", type: :request do
  describe "GET /tech-stack" do
    it "returns 200 with tech stack info" do
      get "/tech-stack"
      expect(response).to have_http_status(:ok)
    end

    it "returns live runtime info" do
      get "/tech-stack"
      runtime = json_response["data"]["runtime"]
      expect(runtime["name"]).to eq("Ruby")
      expect(runtime["version"]).to be_present
    end

    it "returns framework info" do
      get "/tech-stack"
      framework = json_response["data"]["framework"]
      expect(framework["name"]).to eq("Rails")
      expect(framework["version"]).to be_present
    end

    it "returns database connection status" do
      get "/tech-stack"
      database = json_response["data"]["database"]
      expect(database).to include("name", "version", "dialect", "connected")
      expect(database["connected"]).to be(true).or be(false)
    end

    it "returns packages array" do
      get "/tech-stack"
      expect(json_response["data"]["packages"]).to be_an(Array)
      expect(json_response["data"]["packages"].length).to be > 0
    end
  end
end