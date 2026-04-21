using System;
using BlogApi.Application.DTOs.Categories;
using FluentValidation;

namespace BlogApi.Application.Features.Categories
{
    public class CreateCategoryDtoValidator : AbstractValidator<CreateCategoryDto>
    {
        public CreateCategoryDtoValidator() 
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Category name is required.")
                .MaximumLength(50).WithMessage("Category name must not exceed 50 characters.");
        }
    }
}
