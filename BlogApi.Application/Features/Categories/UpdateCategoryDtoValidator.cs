using System;
using System.Security.Cryptography.X509Certificates;
using BlogApi.Application.DTOs.Categories;
using FluentValidation;
namespace BlogApi.Application.Features.Categories
{
    public class UpdateCategoryDtoValidator : AbstractValidator<UpdateCategoryDto>
    {
        public UpdateCategoryDtoValidator() 
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Category name cannot be empty.")
                .MaximumLength(50).WithMessage("Category name can be at most 50 characters.");
        }
    }
}
