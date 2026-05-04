using System;
using System.Collections.Generic;
using System.Text;

using BlogApi.Application.DTOs.Users;
using FluentValidation;

namespace BlogApi.Application.Features.Users
{
    public class UpdateEmailDtoValidator : AbstractValidator<UpdateEmailDto>
    {
        public UpdateEmailDtoValidator()
        {
            RuleFor(x => x.NewEmail)
                .NotEmpty().WithMessage("Email cannot be empty.")
                .EmailAddress().WithMessage("Email format is invalid.");
        }
    }
}
