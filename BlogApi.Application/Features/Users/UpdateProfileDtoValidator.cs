using BlogApi.Application.DTOs.Users;
using FluentValidation;

namespace BlogApi.Application.Features.Users
{
    public class UpdateProfileDtoValidator : AbstractValidator<UpdateProfileDto>
    {
        public UpdateProfileDtoValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name cannot be empty.")
                .MaximumLength(100).WithMessage("Full name can be at most 100 characters.");
        }
    }
}
