using BlogApi.Application.DTOs.Users;
using BlogApi.Application.Enums;
using BlogApi.Application.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogApi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IValidator<UpdateProfileDto> _updateProfileValidator;
        private readonly IValidator<UpdateEmailDto> _updateEmailValidator;
        private readonly IValidator<UpdatePasswordDto> _updatePasswordValidator;



        public UsersController(
            IUserService userService,
            IValidator<UpdateProfileDto> updateProfileValidator, IValidator<UpdateEmailDto> updateEmailValidator, IValidator<UpdatePasswordDto> updatePasswordValidator)
        {
            _userService = userService;
            _updateProfileValidator = updateProfileValidator;
            _updateEmailValidator = updateEmailValidator;
            _updatePasswordValidator = updatePasswordValidator;
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var validationResult = await _updateProfileValidator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                }));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            var result = await _userService.UpdateProfileAsync(userId, dto);

            return result switch
            {
                UserActionResult.NotFound => NotFound(new { message = "User not found" }),
                UserActionResult.Success => NoContent(),
                _ => BadRequest()
            };
        }

        [HttpPut("email")]
        public async Task<IActionResult> UpdateEmail([FromBody] UpdateEmailDto dto)
        {
            var validationResult = await _updateEmailValidator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                }));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            var result = await _userService.UpdateEmailAsync(userId, dto);

            return result switch
            {
                UserActionResult.NotFound => NotFound(new { message = "User not found" }),
                UserActionResult.Conflict => Conflict(new { message = "Email is already in use" }),
                UserActionResult.Success => NoContent(),
                _ => BadRequest()
            };
        }

        [HttpPut("password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto dto)
        {
            var validationResult = await _updatePasswordValidator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                }));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            var result = await _userService.UpdatePasswordAsync(userId, dto);

            return result switch
            {
                UserActionResult.NotFound => NotFound(new { message = "User not found" }),
                UserActionResult.InvalidCredentials => BadRequest(new { message = "Current password is incorrect" }),
                UserActionResult.Success => NoContent(),
                _ => BadRequest()
            };
        }


    }
}
