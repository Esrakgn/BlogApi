using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<Post> Posts { get; set; } = new List<Post>();
        // Bir kategori birden fazla post içerebilir
    }
}
