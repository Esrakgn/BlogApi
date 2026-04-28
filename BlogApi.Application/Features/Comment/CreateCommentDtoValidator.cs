using System;
using BlogApi.Application.DTOs.Comments;
using FluentValidation;

namespace BlogApi.Application.Features.Comment
{
    public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
    {
        public CreateCommentDtoValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Comment content cannot be empty.")
                .MinimumLength(2).WithMessage("Comment content must be at least 2 characters.")
                .MaximumLength(1000).WithMessage("Comment content can be at most 1000 characters.");
        }
    }
}
