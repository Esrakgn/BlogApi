using System;
using System.Collections.Generic;
using System.Text;
using BlogApi.Application.DTOs.Auth;

namespace BlogApi.Application.Interfaces
{
    public interface IAuthService
    {
        // Başarılı olursa token dahil auth response döner
        Task<RegisterResponseDto> RegisterAsync(RegisterDto dto);

        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task ForgotPasswordAsync(ForgotPasswordDto dto);
        Task ResetPasswordAsync(ResetPasswordDto dto);

    }
}
