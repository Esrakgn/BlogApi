using System;
using System.Collections.Generic;
using System.Text;

using BlogApi.Application.DTOs.Users;
using FluentValidation;

namespace BlogApi.Application.Features.Users
{
    public class DeleteProfile1DtoValidator : AbstractValidator<DeleteProfileDto>
    {
        public DeleteProfile1DtoValidator()
        {
            RuleFor(x => x.CurrentPassword)
                .NotEmpty().WithMessage("Current password cannot be empty.");
        }
    }
}
