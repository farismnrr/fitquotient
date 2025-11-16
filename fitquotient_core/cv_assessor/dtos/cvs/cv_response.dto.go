package cvs

type CVResponseDTO struct {
	CVId      string    `json:"cvId"`
	UserId    string    `json:"userId"`
	Filename  string    `json:"filename"`
	SourceUrl string    `json:"sourceUrl"`
	Text      string    `json:"text"`
}
