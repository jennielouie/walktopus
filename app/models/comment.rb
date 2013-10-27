class Comment < ActiveRecord::Base
  attr_accessible :date, :time_of_day, :street_comment, :username, :street_name, :walk_id
  belongs_to :walks

  validates :username, presence: true
  validates :street_name, presence: true
  validates :street_comment, presence: true
  validates :walk_id, presence: true
end
