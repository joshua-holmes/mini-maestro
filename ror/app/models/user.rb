class User < ApplicationRecord
  has_many :tunes
  has_secure_password

  validates :username, uniqueness: true
  validates :username, :first_name, :password, :password_confirmation, presence: true
end
