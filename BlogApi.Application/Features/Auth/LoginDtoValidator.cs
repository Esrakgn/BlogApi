using System;
using BlogApi.Application.DTOs.Auth;
using FluentValidation;

namespace BlogApi.Application.Features.Auth
{
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        public LoginDtoValidator() 
        {
            RuleFor(x => x.Email)
                 .NotEmpty().WithMessage("Email cannot be empty.")
                 .EmailAddress().WithMessage("Email format is invalid.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password cannot be empty.");
        }
    }
}
