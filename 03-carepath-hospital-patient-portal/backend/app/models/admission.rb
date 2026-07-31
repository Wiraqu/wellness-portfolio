class Admission < ApplicationRecord
  belongs_to :patient
  belongs_to :facility
  belongs_to :admitted_by, class_name: 'User'

  has_many :care_plans, dependent: :destroy
  has_many :vital_signs, dependent: :destroy

  enum status: { pending: 0, active: 1, completed: 2, cancelled: 3 }
  enum admission_type: { emergency: 0, elective: 1, urgent: 2, transfer: 3 }

  validates :admission_date, presence: true

  def length_of_stay
    return 0 unless admission_date
    end_date = discharge_date || Time.current
    ((end_date - admission_date) / 1.day.seconds).to_i
  end
end
