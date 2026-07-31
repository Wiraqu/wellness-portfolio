class ApplicationController < ActionController::API
  include Pundit::Authorization
  before_action :authenticate_request

  private

  def authenticate_request
    header = request.headers["Authorization"]
    token = header.split(" ").last if header
    begin
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
      @current_user = User.find(decoded["user_id"])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
