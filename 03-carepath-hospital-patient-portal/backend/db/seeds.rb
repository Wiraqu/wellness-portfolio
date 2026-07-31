# Create facility
facility = Facility.create!(
  name: "St. Mary's Hospital",
  code: "STM-001",
  address: "123 Healthcare Ave, Medical City",
  phone: "+1 555-0100",
  email: "admin@stmarys.com"
)

# Create users
admin = User.create!(email: "admin@carepath.com", password: "password123", name: "System Admin", role: :admin, facility: facility)
doctor = User.create!(email: "dr.gonzalez@carepath.com", password: "password123", name: "Dr. Maria Gonzalez", role: :doctor, specialty: "Orthopedic Surgery", license_number: "MD-45291", facility: facility)
nurse = User.create!(email: "nurse.johnson@carepath.com", password: "password123", name: "Sarah Johnson, RN", role: :nurse, license_number: "RN-78234", facility: facility)

# Create patients
patients = [
  Patient.create!(
    medical_record_number: "MRN-2024-00891",
    name: "John Anderson",
    date_of_birth: "1957-03-15",
    gender: "male",
    blood_type: "O+",
    allergies: ["Penicillin"],
    chronic_conditions: ["Hypertension", "Type 2 Diabetes"],
    emergency_contact_name: "Mary Anderson",
    emergency_contact_phone: "+1 555-0201",
    insurance_provider: "BlueCross",
    insurance_policy_number: "BC-99887766",
    status: :admitted,
    primary_doctor: doctor,
    facility: facility
  ),
  Patient.create!(
    medical_record_number: "MRN-2024-00892",
    name: "Patricia Williams",
    date_of_birth: "1962-08-22",
    gender: "female",
    blood_type: "A-",
    allergies: [],
    chronic_conditions: ["Asthma"],
    emergency_contact_name: "Robert Williams",
    emergency_contact_phone: "+1 555-0202",
    insurance_provider: "Aetna",
    insurance_policy_number: "AE-11223344",
    status: :in_treatment,
    primary_doctor: doctor,
    facility: facility
  ),
]

# Create admissions
admission = Admission.create!(
  patient: patients[0],
  facility: facility,
  admitted_by: doctor,
  admission_date: Time.current - 5.days,
  room_number: "302",
  bed_number: "B",
  admission_type: :elective,
  chief_complaint: "Severe knee pain, limited mobility",
  diagnosis: "Osteoarthritis, right knee — scheduled for total knee replacement",
  status: :active
)

# Create vital signs
VitalSign.create!([
  { patient: patients[0], admission: admission, recorded_by: nurse, vital_type: "blood_pressure", value: 128, unit: "mmHg", recorded_at: Time.current - 2.hours },
  { patient: patients[0], admission: admission, recorded_by: nurse, vital_type: "heart_rate", value: 72, unit: "bpm", recorded_at: Time.current - 2.hours },
  { patient: patients[0], admission: admission, recorded_by: nurse, vital_type: "temperature", value: 36.6, unit: "°C", recorded_at: Time.current - 2.hours },
  { patient: patients[0], admission: admission, recorded_by: nurse, vital_type: "oxygen_saturation", value: 98, unit: "%", recorded_at: Time.current - 2.hours },
])

# Create medications
Medication.create!([
  { patient: patients[0], prescribed_by: doctor, name: "Amoxicillin", dosage: "500mg", frequency: "3x daily", route: "Oral", start_date: Time.current - 4.days, status: :active, instructions: "Take with food" },
  { patient: patients[0], prescribed_by: doctor, name: "Ibuprofen", dosage: "400mg", frequency: "As needed", route: "Oral", start_date: Time.current - 4.days, status: :active, instructions: "For pain, max 3 per day" },
  { patient: patients[0], prescribed_by: doctor, name: "Enoxaparin", dosage: "40mg", frequency: "1x daily", route: "Subcutaneous", start_date: Time.current - 4.days, end_date: Time.current - 1.day, status: :completed, instructions: "DVT prophylaxis" },
])

# Create care plans
CarePlan.create!([
  { patient: patients[0], admission: admission, created_by: doctor, title: "Post-op Pain Management", description: "Multimodal analgesia protocol", planned_start: Time.current - 4.days, actual_start: Time.current - 4.days, status: :in_progress, priority: :high },
  { patient: patients[0], admission: admission, created_by: doctor, title: "Physical Therapy — Knee ROM", description: "Range of motion exercises post-TKR", planned_start: Time.current - 2.days, actual_start: Time.current - 2.days, status: :in_progress, priority: :high },
])

puts "Seeds created successfully!"
