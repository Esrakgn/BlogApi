using System;
using BlogApi.Application.DTOs.Posts;
using FluentValidation;

namespace BlogApi.Application.Features.Posts
{
    public class UpdatePostDtoValidator :AbstractValidator<UpdatePostDto>
    {
        public UpdatePostDtoValidator() 
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(100).WithMessage("Title can be at most 100 characters.");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Content cannot be empty.")
                .MinimumLength(10).WithMessage("Content must be at least 10 characters.");

            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("Category must be selected.");
        }
    }
}
