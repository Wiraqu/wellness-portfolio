module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_request, only: [:login, :register]

      def login
        user = User.find_by(email: params[:email])
        if user&.authenticate(params[:password])
          token = JWT.encode({ user_id: user.id, exp: 7.days.from_now.to_i }, Rails.application.credentials.secret_key_base)
          render json: { token: token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
        else
          render json: { error: "Invalid credentials" }, status: :unauthorized
        end
      end

      def register
        user = User.new(user_params)
        if user.save
          token = JWT.encode({ user_id: user.id, exp: 7.days.from_now.to_i }, Rails.application.credentials.secret_key_base)
          render json: { token: token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def me
        render json: { user: { id: current_user.id, name: current_user.name, email: current_user.email, role: current_user.role } }
      end

      private

      def user_params
        params.permit(:email, :password, :password_confirmation, :name, :role)
      end
    end
  end
end
