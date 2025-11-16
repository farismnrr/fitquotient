package cvs

type CreateCVDTO struct {
	CVId      string `json:"cvId" validate:"required,uuid" form:"cvId"`
	UserID    string `json:"userId" validate:"required,uuid" form:"userId"`
	Filename  string `json:"filename" validate:"required,max=255" form:"filename"`
	SourceURL string `json:"sourceUrl" validate:"required,url" form:"sourceUrl"`
	Text      string `json:"text" validate:"required,min=10" form:"text"`
}
