class CreateTunes < ActiveRecord::Migration[7.0]
  def change
    create_table :tunes do |t|
      t.text :abc
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
