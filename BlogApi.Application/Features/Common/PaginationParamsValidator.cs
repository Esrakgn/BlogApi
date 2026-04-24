using System;
using System.Collections.Generic;
using System.Text;
using BlogApi.Application.DTOs.Common;
using FluentValidation;

namespace BlogApi.Application.Features.Common
{
    public class PaginationParamsValidator : AbstractValidator<PaginationParams>    
    {
        public PaginationParamsValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0).WithMessage("PageNumber must be greater than 0");

            RuleFor(x => x.PageSize)
                .GreaterThan(0).WithMessage("PageSize must be greater than 0.")
                .LessThanOrEqualTo(50).WithMessage("PageSize cannot be greater than 50.");
        
        }
    }
}
//page kısmı için validator 