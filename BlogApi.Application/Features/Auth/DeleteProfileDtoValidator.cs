using BlogApi.Application.DTOs.Users;
using FluentValidation;

namespace BlogApi.Application.Features.Auth
{
    public class DeleteProfileDtoValidator : AbstractValidator<DeleteAccountDto>
    {
        public DeleteProfileDtoValidator()
        {
            RuleFor(x => x.CurrentPassword)
                .NotEmpty().WithMessage("Current password cannot be empty.");
        }
    }
}
