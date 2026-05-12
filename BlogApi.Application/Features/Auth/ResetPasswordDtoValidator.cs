using BlogApi.Application.DTOs.Auth;
using FluentValidation;

namespace BlogApi.Application.Features.Auth
{
    public class ResetPasswordDtoValidator : AbstractValidator<ResetPasswordDto>
    {
        public ResetPasswordDtoValidator()
        {
            RuleFor(x => x.Token)
                .NotEmpty().WithMessage("Token cannot be empty.");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("New password cannot be empty.")
                .MinimumLength(6).WithMessage("New password must be at least 6 characters.");
        }
    }
}
