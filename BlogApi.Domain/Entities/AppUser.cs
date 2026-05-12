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

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        // kullanıcının yazdığı yorumları tutar / bir kullanıcı birden fazla yorum yazabilir

        public ICollection<PasswordResetToken> PasswordResetTokens { get; set; } = new List<PasswordResetToken>();

        public bool IsDeleted { get; set; } = false;

        public DateTime? DeletedAt { get; set; }

        // soft delete yapıyoruz burda kullanıcı kaydı gerçekten durur ama uygulama onu “aktif değil” kabul eder.
    }
}
