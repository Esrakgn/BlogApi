using BlogApi.Application.DTOs.Auth;
using BlogApi.Application.Enums;
using BlogApi.Application.Interfaces;
using BlogApi.Domain.Entities;
using BlogApi.Domain.Enums;
using BlogApi.Infrastructure.Data;
using BlogApi.Infrastructure.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

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

            if (user.IsDeleted)
            {
                throw new Exception("This account has been deleted.");
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


        public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            // Kullanıcı email ile var mı kontrol ediyoruz
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            // Kullanıcı yoksa da aynı davranış: bilgi sızdırmıyoruz
            if (user == null)
            {
                return;
            }

            // Rastgele reset token üretiyoruz
            var rawToken = GenerateResetToken();

            // Token'ın kendisini değil hash'ini saklıyoruz
            var tokenHash = ComputeSha256(rawToken);

            // Token kaydını oluşturuyoruz (15 dk geçerli, tek kullanımlık)
            var resetToken = new PasswordResetToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };

            // Database'e kaydediyoruz
            _context.PasswordResetTokens.Add(resetToken);
            await _context.SaveChangesAsync();

            // Mail servisi yoksa test için token'ı logluyoruz
            Console.WriteLine($"[RESET TOKEN] {user.Email} -> {rawToken}");
        }

        public async Task ResetPasswordAsync(ResetPasswordDto dto)
        {
            // Gelen token'ı hashliyoruz
            var tokenHash = ComputeSha256(dto.Token);

            // Geçerli reset token kaydını buluyoruz
            var resetToken = await _context.PasswordResetTokens
                .Include(x => x.User)
                .Where(x => x.TokenHash == tokenHash)
                .Where(x => !x.IsUsed)
                .Where(x => x.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

            if (resetToken == null)
            {
                throw new Exception("Invalid or expired reset token.");
            }

            // Yeni şifreyi yine BCrypt ile hashliyoruz
            resetToken.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            // Token'ı tek kullanımlık işaretliyoruz
            resetToken.IsUsed = true;

            // Database'e kaydediyoruz
            await _context.SaveChangesAsync();
        }

        private static string ComputeSha256(string rawData)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            return Convert.ToHexString(bytes);
        }

        private static string GenerateResetToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(32);
            return Convert.ToBase64String(bytes);
        }
    }
}
