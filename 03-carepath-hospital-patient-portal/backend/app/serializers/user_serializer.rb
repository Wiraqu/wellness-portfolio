class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :name, :email, :role, :specialty, :license_number
end
