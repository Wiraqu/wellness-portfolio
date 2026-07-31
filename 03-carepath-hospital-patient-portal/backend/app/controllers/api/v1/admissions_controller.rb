module Api
  module V1
    class AdmissionsController < ApplicationController
      def show
        admission = Admission.find(params[:id])
        render json: admission, include: [:patient, :care_plans, :vital_signs]
      end

      def create
        admission = Admission.new(admission_params)
        admission.admitted_by = current_user
        admission.facility_id = current_user.facility_id
        if admission.save
          render json: admission, status: :created
        else
          render json: { errors: admission.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        admission = Admission.find(params[:id])
        if admission.update(admission_params)
          render json: admission
        else
          render json: { errors: admission.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def discharge
        admission = Admission.find(params[:id])
        admission.update!(status: :completed, discharge_date: Time.current)
        admission.patient.update!(status: :discharged)
        render json: admission
      end

      def transfer
        admission = Admission.find(params[:id])
        admission.update!(status: :cancelled)
        admission.patient.update!(status: :transferred)
        render json: admission
      end

      private

      def admission_params
        params.permit(:patient_id, :admission_date, :room_number, :bed_number, :admission_type, :chief_complaint, :diagnosis)
      end
    end
  end
end
