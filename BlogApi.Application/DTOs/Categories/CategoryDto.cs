using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Categories
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
