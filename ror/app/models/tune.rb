class Tune < ApplicationRecord
  belongs_to :user

  validates :abc, presence: true
end
