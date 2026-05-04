using System;
using System.Collections.Generic;
using System.Text;


namespace BlogApi.Application.DTOs.Users
{
    public class UpdateEmailDto
    {
        public string NewEmail { get; set; } = string.Empty;
    }
}
