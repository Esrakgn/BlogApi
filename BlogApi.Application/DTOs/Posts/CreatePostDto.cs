using System;
using System.Collections.Generic;
using System.Text;


namespace BlogApi.Application.DTOs.Posts
{
    public class CreatePostDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
    }
}
//burada sadece başlık ve içerik var çünkü post oluştururken kullanıcı sadece bunları girecek
/// id, authorId, createdAt gibi alanlar sistem tarafından otomatik olarak atanacak