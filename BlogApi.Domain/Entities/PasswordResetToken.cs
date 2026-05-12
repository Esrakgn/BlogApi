using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Domain.Entities
{
    public class PasswordResetToken
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public string TokenHash { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
