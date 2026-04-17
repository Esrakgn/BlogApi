using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Posts
{
    public class UpdatePostDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
    }
}
