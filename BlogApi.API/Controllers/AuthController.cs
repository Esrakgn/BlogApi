using BlogApi.Application.DTOs.Auth;
using BlogApi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogApi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
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

    }
}