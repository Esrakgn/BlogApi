using BlogApi.Application.DTOs.Auth;
using BlogApi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using FluentValidation;

namespace BlogApi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IValidator<RegisterDto> _registerValidator;
        private readonly IValidator<LoginDto> _loginValidator;
        private readonly IValidator<ForgotPasswordDto> _forgotPasswordValidator;
        private readonly IValidator<ResetPasswordDto> _resetPasswordValidator;


        public AuthController(IAuthService authService, IValidator<RegisterDto> registerValidator, IValidator<LoginDto> loginValidator,
            IValidator<ForgotPasswordDto> forgotPasswordValidator,
             IValidator<ResetPasswordDto> resetPasswordValidator)
        {
            _authService = authService;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
            _forgotPasswordValidator = forgotPasswordValidator;
            _resetPasswordValidator = resetPasswordValidator;

        }

        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var validationResult = await _registerValidator.ValidateAsync(dto);
            // register dto doğrulamasını çalıştırıyoruz

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                }));
                // validation hataları varsa service'e gitmeden 400 dönüyoruz
            }

            try
            {
                var result = await _authService.RegisterAsync(dto);

                // 201 Created → yeni resource oluşturuldu
                return Created("", result);
            }
            catch (Exception ex)
            {
                // Email zaten varsa → 400 BadRequest
                return BadRequest(new { message = ex.Message });
            }
        }

        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var validationResult = await _loginValidator.ValidateAsync(dto);
            // login dto doğrulamasını çalıştırıyoruz

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                }));
                // validation hataları varsa service'e gitmeden 400 dönüyoruz
            }

            try
            {
                var result = await _authService.LoginAsync(dto);

                // 200 OK → başarılı login
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Hatalı giriş → 401 Unauthorized
                return Unauthorized(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                message = "Token geçerli, giriş yapıldı.",
                userId,
                email,
                role
            });
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var validationResult = await _forgotPasswordValidator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                }));
            }

            await _authService.ForgotPasswordAsync(dto);

            return Ok(new { message = "If the account exists, a reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var validationResult = await _resetPasswordValidator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                }));
            }

            try
            {
                await _authService.ResetPasswordAsync(dto);
                return Ok(new { message = "Password has been reset successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
