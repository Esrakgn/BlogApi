using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Common
{
    public class PostQueryParams : PaginationParams
    {
        public string? SortBy { get; set; } = "newest";
    }
}