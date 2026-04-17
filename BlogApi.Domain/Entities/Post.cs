using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Domain.Entities
{
    public class Post
    { 
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // postun oluşturulma tarihi/ default olarak şu anki zamanı atıyoruz
        public Guid AuthorId { get; set; }
        // postun yazarı olacak kullanıcı id'si/ foreign key gibi çalışır
        public AppUser Author { get; set; } = null!;
        public DateTime? UpdatedAt { get; set; }
        // postun güncellenme tarihi/ nullable çünkü her post güncellenmeyebilir

        public Guid CategoryId { get; set; }
        
        // postun ait olduğu kategori id'si ve kategori bilgisi 
        public Category Category { get; set; } = null!;
        
    }
}
//many-to-one ilişkisi var, bir postun bir yazarı var, bir yazarın birçok postu olabilir