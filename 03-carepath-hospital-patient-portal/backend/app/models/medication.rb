class Medication < ApplicationRecord
  belongs_to :patient
  belongs_to :prescribed_by, class_name: 'User'

  enum status: { active: 0, discontinued: 1, completed: 2, on_hold: 3 }

  validates :name, presence: true
end
