# frozen_string_literal: true

Rails.application.routes.draw do
  get "profile",         to: "profile#show"
  get "work-experience", to: "work_experience#index"
  get "education",       to: "education#index"
  get "skills",          to: "skills#index"
  get "projects",        to: "projects#index"
  get "tech-stack",      to: "tech_stack#show"
end