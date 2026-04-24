using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Comments
{
    public class CommentDto
    {
        public Guid Id { get; set; }

        public string Content { get; set; } = string.Empty;

        public Guid PostId { get; set; }

        public Guid UserId { get; set; }

        public string UserName { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}

//api dışarı yorum dönerken bunu kullanacak