class PatientSerializer
  include JSONAPI::Serializer

  attributes :id, :medical_record_number, :name, :date_of_birth, :gender, :blood_type,
             :allergies, :chronic_conditions, :emergency_contact_name,
             :emergency_contact_phone, :insurance_provider, :status, :created_at

  attribute :age do |object|
    object.age
  end

  attribute :current_admission do |object|
    object.current_admission&.as_json(only: [:id, :room_number, :bed_number, :status, :admission_date])
  end

  belongs_to :primary_doctor, serializer: UserSerializer
  has_many :admissions
  has_many :vital_signs
  has_many :medications
end
