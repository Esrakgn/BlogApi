using BlogApi.Application.DTOs.Users;
using BlogApi.Application.Enums;

namespace BlogApi.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserActionResult> UpdateProfileAsync(Guid userId, UpdateProfileDto dto);
        Task<UserActionResult> UpdateEmailAsync(Guid userId, UpdateEmailDto dto);
        Task<UserActionResult> UpdatePasswordAsync(Guid userId, UpdatePasswordDto dto);

        Task<UserActionResult> DeleteProfileAsync(Guid userId, DeleteProfileDto dto);

    }
}