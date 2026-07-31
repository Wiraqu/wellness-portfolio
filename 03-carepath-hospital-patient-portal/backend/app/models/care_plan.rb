class CarePlan < ApplicationRecord
  belongs_to :patient
  belongs_to :admission, optional: true
  belongs_to :created_by, class_name: 'User'

  enum status: { planned: 0, in_progress: 1, completed: 2, cancelled: 3 }
  enum priority: { low: 0, medium: 1, high: 2, critical: 3 }

  validates :title, presence: true
end
