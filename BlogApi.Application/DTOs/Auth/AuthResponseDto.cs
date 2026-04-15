using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;

    }
}
//başarılı giriş veya kayıttan sonra kullanıcıya döneceğimiz response modeli
