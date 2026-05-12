using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Users
{
    public class DeleteProfileDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
    }
}
