using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Auth
{
    public class ForgotPasswordDto
    {
        public string Email { get; set; } = string.Empty;
    }
}
