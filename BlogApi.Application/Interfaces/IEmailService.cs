using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendAsync(string toEmail, string subject, string body);
    }
}
