class CreateInitialSchema < ActiveRecord::Migration[7.1]
  def change
    create_table :facilities do |t|
      t.string :name, null: false
      t.string :code, null: false
      t.string :address
      t.string :phone
      t.string :email
      t.jsonb :settings, default: {}
      t.timestamps
    end
    add_index :facilities, :code, unique: true

    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :name, null: false
      t.integer :role, default: 0
      t.integer :status, default: 0
      t.string :license_number
      t.string :specialty
      t.string :phone
      t.references :facility, foreign_key: true
      t.timestamps
    end
    add_index :users, :email, unique: true

    create_table :patients do |t|
      t.string :medical_record_number, null: false
      t.string :name, null: false
      t.date :date_of_birth
      t.string :gender
      t.string :blood_type
      t.text :allergies, array: true, default: []
      t.text :chronic_conditions, array: true, default: []
      t.string :emergency_contact_name
      t.string :emergency_contact_phone
      t.string :insurance_provider
      t.string :insurance_policy_number
      t.integer :status, default: 0
      t.references :primary_doctor, foreign_key: { to_table: :users }
      t.references :facility, foreign_key: true
      t.timestamps
    end
    add_index :patients, :medical_record_number, unique: true

    create_table :admissions do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :facility, null: false, foreign_key: true
      t.references :admitted_by, null: false, foreign_key: { to_table: :users }
      t.datetime :admission_date, null: false
      t.datetime :discharge_date
      t.string :room_number
      t.string :bed_number
      t.integer :status, default: 0
      t.integer :admission_type, default: 0
      t.text :chief_complaint
      t.text :diagnosis
      t.text :discharge_summary
      t.timestamps
    end

    create_table :vital_signs do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :admission, foreign_key: true
      t.references :recorded_by, null: false, foreign_key: { to_table: :users }
      t.string :vital_type, null: false
      t.decimal :value, precision: 10, scale: 2
      t.string :unit
      t.datetime :recorded_at, null: false
      t.timestamps
    end

    create_table :medications do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :prescribed_by, null: false, foreign_key: { to_table: :users }
      t.string :name, null: false
      t.string :dosage
      t.string :frequency
      t.string :route
      t.datetime :start_date
      t.datetime :end_date
      t.integer :status, default: 0
      t.text :instructions
      t.timestamps
    end

    create_table :care_plans do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :admission, foreign_key: true
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.string :title, null: false
      t.text :description
      t.datetime :planned_start
      t.datetime :planned_end
      t.datetime :actual_start
      t.datetime :actual_end
      t.integer :status, default: 0
      t.integer :priority, default: 0
      t.timestamps
    end

    create_table :documents do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :uploaded_by, null: false, foreign_key: { to_table: :users }
      t.string :title, null: false
      t.string :doc_type
      t.string :file_url
      t.integer :status, default: 0
      t.timestamps
    end
  end
end
