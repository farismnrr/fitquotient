package entities

import "time"

type CvEntity struct {
	CVId      string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"cvId"`
	UserId    string    `gorm:"type:uuid;index" json:"userId"`
	Filename  string    `json:"filename"`
	SourceUrl string    `json:"sourceUrl"`
	Text      string    `gorm:"type:text" json:"text"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
