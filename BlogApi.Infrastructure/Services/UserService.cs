using BlogApi.Application.DTOs.Users;
using BlogApi.Application.Enums;
using BlogApi.Application.Interfaces;
using BlogApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserActionResult> UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
            {
                return UserActionResult.NotFound;
            }

            user.FullName = dto.FullName;
            await _context.SaveChangesAsync();

            return UserActionResult.Success;
        }

        public async Task<UserActionResult> UpdateEmailAsync(Guid userId, UpdateEmailDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
            {
                return UserActionResult.NotFound;
            }

            var emailExists = await _context.Users.AnyAsync(x => x.Email == dto.NewEmail && x.Id != userId);

            if (emailExists)
            {
                return UserActionResult.Conflict;
            }

            user.Email = dto.NewEmail;
            await _context.SaveChangesAsync();

            return UserActionResult.Success;
        }

    }
}
