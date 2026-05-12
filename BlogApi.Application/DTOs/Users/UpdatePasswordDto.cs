using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Users
{
    public class UpdatePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
