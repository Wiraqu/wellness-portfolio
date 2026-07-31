class PatientPolicy < ApplicationPolicy
  def show?
    user.admin? || user.doctor? || user.nurse?
  end

  def create?
    user.admin? || user.doctor?
  end

  def update?
    user.admin? || (user.doctor? && record.primary_doctor_id == user.id)
  end

  def destroy?
    user.admin?
  end

  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      elsif user.doctor?
        scope.where(primary_doctor_id: user.id)
      else
        scope.where(facility_id: user.facility_id)
      end
    end
  end
end
