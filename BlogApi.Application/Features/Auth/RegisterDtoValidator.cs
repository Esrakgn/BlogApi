using System;
using BlogApi.Application.DTOs.Auth;
using FluentValidation;

namespace BlogApi.Application.Features.Auth
{
    public class RegisterDtoValidator :AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name cannot be empty.")
                .MaximumLength(100).WithMessage("Full name can be at most 100 characters.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email cannot be empty.")
                .EmailAddress().WithMessage("Email format is invalid.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password cannot be empty.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters.");

            RuleFor(x => x.Role)
                .Must(role => string.IsNullOrWhiteSpace(role) || role == "User" || role == "Author")
                .WithMessage("Role must be User or Author.");
        }
    }
}
