class VitalSign < ApplicationRecord
  belongs_to :patient
  belongs_to :admission, optional: true
  belongs_to :recorded_by, class_name: 'User'

  validates :vital_type, :value, :recorded_at, presence: true

  scope :recent, -> { order(recorded_at: :desc).limit(100) }
  scope :by_type, ->(type) { where(vital_type: type) }
end
