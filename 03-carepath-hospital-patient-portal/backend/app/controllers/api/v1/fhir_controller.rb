module Api
  module V1
    class FhirController < ApplicationController
      def patient
        patient = Patient.find(params[:id])
        fhir_patient = FHIR::Patient.new(
          id: patient.id,
          identifier: [{ system: "http://carepath.com/mrn", value: patient.medical_record_number }],
          name: [{ use: "official", family: patient.name.split.last, given: [patient.name.split.first] }],
          gender: patient.gender,
          birthDate: patient.date_of_birth&.to_s
        )
        render json: fhir_patient.to_json
      end

      def observation
        vital = VitalSign.find(params[:id])
        fhir_obs = FHIR::Observation.new(
          id: vital.id,
          status: "final",
          category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs" }] }],
          code: { coding: [{ system: "http://loinc.org", code: loinc_code(vital.vital_type), display: vital.vital_type }] },
          subject: { reference: "Patient/#{vital.patient_id}" },
          effectiveDateTime: vital.recorded_at.iso8601,
          valueQuantity: { value: vital.value.to_f, unit: vital.unit }
        )
        render json: fhir_obs.to_json
      end

      private

      def loinc_code(type)
        {
          "blood_pressure" => "85354-9",
          "heart_rate" => "8867-4",
          "temperature" => "8310-5",
          "respiratory_rate" => "9279-1",
          "oxygen_saturation" => "2708-6"
        }[type] || "unknown"
      end
    end
  end
end
