module Api
  module V1
    class DashboardController < ApplicationController
      def metrics
        facility_id = current_user.facility_id
        render json: {
          total_patients: Patient.where(facility_id: facility_id).count,
          admitted_today: Admission.where(facility_id: facility_id, admission_date: Date.current.all_day).count,
          active_admissions: Admission.where(facility_id: facility_id, status: :active).count,
          discharged_today: Admission.where(facility_id: facility_id, status: :completed, discharge_date: Date.current.all_day).count,
          avg_length_of_stay: Admission.where(facility_id: facility_id, status: :completed).average("EXTRACT(EPOCH FROM (discharge_date - admission_date)) / 86400")&.round(1) || 0,
          bed_occupancy: calculate_occupancy(facility_id)
        }
      end

      def occupancy
        facility_id = current_user.facility_id
        data = (0..6).map do |i|
          date = Date.current - i.days
          {
            date: date.to_s,
            admissions: Admission.where(facility_id: facility_id, admission_date: date.all_day).count,
            discharges: Admission.where(facility_id: facility_id, status: :completed, discharge_date: date.all_day).count
          }
        end.reverse
        render json: data
      end

      private

      def calculate_occupancy(facility_id)
        total_beds = 200 # configurable per facility
        occupied = Admission.where(facility_id: facility_id, status: :active).count
        ((occupied.to_f / total_beds) * 100).round(1)
      end
    end
  end
end
