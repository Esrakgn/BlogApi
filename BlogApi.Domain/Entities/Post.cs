using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Domain.Entities
{
    public class Post
    { 
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        //blog yazısının başkığı postta kullanıcı bunu gircek
        public string Content { get; set; } = string.Empty;
        //asıl metin burada olacak
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // postun oluşturulma tarihi/ default olarak şu anki zamanı atıyoruz
        public Guid AuthorId { get; set; }
        // postun yazarı olacak kullanıcı id'si/ foreign key gibi çalışır

        public AppUser Author { get; set; } = null!;
        // postun yazarı olacak kullanıcı bilgisi/ navigation property gibi çalışır

        public DateTime? UpdatedAt { get; set; }
        // postun güncellenme tarihi/ nullable çünkü her post güncellenmeyebilir
    }
}
