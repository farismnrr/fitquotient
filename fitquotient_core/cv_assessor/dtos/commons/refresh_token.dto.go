package dtos

type RefreshTokenDTO struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}
