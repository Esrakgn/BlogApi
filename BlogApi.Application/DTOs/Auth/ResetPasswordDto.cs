using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Auth
{
    public class ResetPasswordDto
    {
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
//kullanıcı maildeki token + yeni şifre gönderir.