using System;
using System.Collections.Generic;
using System.Text;
using BlogApi.Domain.Enums;

namespace BlogApi.Domain.Entities
{
    public class AppUser
    {
        public Guid Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.User;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Post> Posts { get; set; } = new List<Post>();
        // Kullanıcının yazdığı postları tutacak koleksiyon/ navigation property gibi çalışır
        //bir kullanıcı birden fazla post yazabilir, bu yüzden koleksiyon olarak tanımlıyoruz

    }
}
