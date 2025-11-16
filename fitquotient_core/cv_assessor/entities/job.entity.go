package entities

import "time"

type JobEntity struct {
	JobID     string    `gorm:"primaryKey;type:uuid" json:"jobId"`
	Text      string    `gorm:"type:text" json:"text"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
