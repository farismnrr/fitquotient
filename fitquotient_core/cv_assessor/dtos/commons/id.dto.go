package dtos

type IDDTO struct {
	ID string `uri:"id" json:"id" validate:"required,uuid"`
}