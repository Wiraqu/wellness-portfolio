class Facility < ApplicationRecord
  has_many :users, dependent: :nullify
  has_many :patients, dependent: :nullify
  has_many :admissions, dependent: :nullify

  validates :name, :code, presence: true
  validates :code, uniqueness: true
end
