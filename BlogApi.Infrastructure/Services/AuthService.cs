using BlogApi.Application.DTOs.Auth;
using BlogApi.Application.Enums;
using BlogApi.Application.Interfaces;
using BlogApi.Domain.Entities;
using BlogApi.Domain.Enums;
using BlogApi.Infrastructure.Data;
using BlogApi.Infrastructure.Helpers;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        
        private readonly AppDbContext _context;

        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public AuthService(AppDbContext context, JwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<RegisterResponseDto> RegisterAsync(RegisterDto dto)
        {
            // Aynı email ile kullanıcı var mı kontrol ediyoruz
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (existingUser != null)
            {
                throw new Exception("Email already exists");
            }

            // Düz şifreyi hashliyoruz
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var role = dto.Role == UserRole.Author.ToString()
                ? UserRole.Author
                : UserRole.User;

            // Yeni kullanıcı oluşturuyoruz
            var user = new AppUser
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = passwordHash,
                Role = role
            };


            // Database'e kaydediyoruz
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Register response'ta token dönmüyoruz
            return new RegisterResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
                Message = "User registered successfully"
            };

        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            // Email ile kullanıcıyı buluyoruz
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Girilen düz şifre ile database'deki hash'i karşılaştırıyoruz
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                throw new Exception("Invalid password");
            }

           
            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString()
            };

        }
    }
}
