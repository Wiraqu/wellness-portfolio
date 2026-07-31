class User < ApplicationRecord
  has_secure_password

  enum role: { admin: 0, doctor: 1, nurse: 2, patient_role: 3, caregiver: 4 }
  enum status: { active: 0, inactive: 1, suspended: 2 }

  belongs_to :facility, optional: true
  has_many :patients, class_name: 'Patient', foreign_key: 'primary_doctor_id'
  has_many :appointments, dependent: :destroy
  has_many :documents, foreign_key: 'uploaded_by_id'

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
end
