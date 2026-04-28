using BlogApi.Application.DTOs.Common;
using FluentValidation;

namespace BlogApi.Application.Features.Common
{
    public class PostQueryParamsValidator : AbstractValidator<PostQueryParams>
    {
        public PostQueryParamsValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0).WithMessage("PageNumber must be greater than 0.");

            RuleFor(x => x.PageSize)
                .GreaterThan(0).WithMessage("PageSize must be greater than 0.")
                .LessThanOrEqualTo(50).WithMessage("PageSize cannot be greater than 50.");

            RuleFor(x => x.SortBy)
                .Must(x => x == "newest" || x == "oldest")
                .WithMessage("SortBy must be either 'newest' or 'oldest'.");
        }
    }
}
