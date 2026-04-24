using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Comments
{
    public class CreateCommentDto
    {
        public string Content { get; set; } = string.Empty;
    }
}
//yeni yorum eklerken body'den sadece yorum metni gelsin diye 
