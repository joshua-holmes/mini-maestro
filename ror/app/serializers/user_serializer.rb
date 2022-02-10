class UserSerializer < ActiveModel::Serializer
  attributes :username, :first_name
  has_many :tunes
end
