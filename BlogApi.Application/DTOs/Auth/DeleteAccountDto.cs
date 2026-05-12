using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.DTOs.Users
{
    public class DeleteAccountDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
    }
}
//hesabı silmeden önce kimliğini doğrulamak için mevcut şifre isteriz.