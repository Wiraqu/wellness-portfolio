class Patient < ApplicationRecord
  belongs_to :primary_doctor, class_name: 'User', optional: true
  belongs_to :facility

  has_many :admissions, dependent: :destroy
  has_many :appointments, dependent: :destroy
  has_many :medications, dependent: :destroy
  has_many :documents, dependent: :destroy
  has_many :vital_signs, dependent: :destroy
  has_many :care_plans, dependent: :destroy

  enum status: { admitted: 0, in_treatment: 1, recovering: 2, discharged: 3, transferred: 4 }

  validates :medical_record_number, presence: true, uniqueness: true
  validates :name, presence: true

  def current_admission
    admissions.where(status: [:pending, :active]).order(created_at: :desc).first
  end

  def age
    return nil unless date_of_birth
    ((Time.current - date_of_birth.to_time) / 1.year.seconds).floor
  end
end
