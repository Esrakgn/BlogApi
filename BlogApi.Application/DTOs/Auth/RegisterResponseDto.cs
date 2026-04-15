using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Auth
{
    public class RegisterResponseDto
    {
        
        public Guid UserId { get; set; }

     
        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;
    }
}