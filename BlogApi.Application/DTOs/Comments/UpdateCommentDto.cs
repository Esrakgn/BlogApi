using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Comments
{
    public class UpdateCommentDto
    {
        public string Content { get; set; } = string.Empty;
    }
}
//yorum güncellerken sadece içerik değişsin 