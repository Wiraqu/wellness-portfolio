class Document < ApplicationRecord
  belongs_to :patient
  belongs_to :uploaded_by, class_name: 'User'

  enum doc_type: { consent: 0, clinical: 1, lab_result: 2, imaging: 3, plan: 4, discharge: 5 }
  enum status: { pending: 0, signed: 1, archived: 2 }

  validates :title, presence: true
end
