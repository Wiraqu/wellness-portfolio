module Api
  module V1
    class PatientsController < ApplicationController
      def index
        patients = Patient.page(params[:page]).per(params[:per_page] || 20)
        render json: { data: patients, meta: { total: Patient.count, page: patients.current_page, per_page: patients.limit_value } }
      end

      def show
        patient = Patient.find(params[:id])
        authorize patient
        render json: patient, include: [:admissions, :vital_signs, :medications, :care_plans]
      end

      def create
        patient = Patient.new(patient_params)
        patient.facility_id = current_user.facility_id
        if patient.save
          render json: patient, status: :created
        else
          render json: { errors: patient.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        patient = Patient.find(params[:id])
        authorize patient
        if patient.update(patient_params)
          render json: patient
        else
          render json: { errors: patient.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        patient = Patient.find(params[:id])
        authorize patient
        patient.destroy
        head :no_content
      end

      private

      def patient_params
        params.permit(:name, :date_of_birth, :gender, :blood_type, :emergency_contact_name, :emergency_contact_phone, :insurance_provider, :insurance_policy_number, allergies: [], chronic_conditions: [])
      end
    end
  end
end
