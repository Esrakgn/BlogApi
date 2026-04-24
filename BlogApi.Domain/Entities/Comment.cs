using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Domain.Entities
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt {  get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public Guid PostId { get; set; }
        //yorumun ait olduğu post id
        public Post Post { get; set; } = null!;
        //yorumun ait olduğu post
        public Guid UserId { get; set; }
        public AppUser User { get; set; }
        //yorumu yazan kullanıcı

    }
}
