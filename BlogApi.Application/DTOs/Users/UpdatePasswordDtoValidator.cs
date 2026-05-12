using BlogApi.Application.DTOs.Users;
using FluentValidation;

namespace BlogApi.Application.Features.Users
{
    public class UpdatePasswordDtoValidator : AbstractValidator<UpdatePasswordDto>
    {
        public UpdatePasswordDtoValidator()
        {
            RuleFor(x => x.CurrentPassword)
                .NotEmpty().WithMessage("Current password cannot be empty.");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("New password cannot be empty.")
                .MinimumLength(6).WithMessage("New password must be at least 6 characters.");
        }
    }
}
