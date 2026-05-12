using BlogApi.Application.DTOs.Auth;
using FluentValidation;

namespace BlogApi.Application.Features.Auth
{
    public class ForgotPasswordDtoValidator : AbstractValidator<ForgotPasswordDto>
    {
        public ForgotPasswordDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email cannot be empty.")
                .EmailAddress().WithMessage("Email format is invalid.");
        }
    }
}
