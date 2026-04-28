using BlogApi.Application.DTOs.Comments;
using BlogApi.Application.Enums;
using BlogApi.Application.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogApi.API.Controllers
{
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IValidator<CreateCommentDto> _createCommentValidator;
        private readonly IValidator<UpdateCommentDto> _updateCommentValidator;

        public CommentsController(
            ICommentService commentService,
            IValidator<CreateCommentDto> createCommentValidator,
            IValidator<UpdateCommentDto> updateCommentValidator)
        {
            _commentService = commentService;
            _createCommentValidator = createCommentValidator;
            _updateCommentValidator = updateCommentValidator;
        }

        [HttpGet("api/posts/{postId:guid}/comments")]
        public async Task<IActionResult> GetByPostId(Guid postId)
        {
            var comments = await _commentService.GetByPostIdAsync(postId);
            return Ok(comments);
        }

        [Authorize]
        [HttpPost("api/posts/{postId:guid}/comments")]
        public async Task<IActionResult> Create(Guid postId, [FromBody] CreateCommentDto dto)
        {
            var validationResult = await _createCommentValidator.ValidateAsync(dto);

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

            try
            {
                var createdComment = await _commentService.CreateAsync(postId, userId, dto);
                return Ok(createdComment);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("api/comments/{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCommentDto dto)
        {
            var validationResult = await _updateCommentValidator.ValidateAsync(dto);

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

            var result = await _commentService.UpdateAsync(id, userId, dto);

            return result switch // switch: result hangi değerse ona karşılık gelen satır çalışır.return kullanmaya gerek kalmıyor gibi
            {
                CommentActionResult.NotFound => NotFound(new { message = "Comment not found" }),
                CommentActionResult.Forbidden => Forbid(),
                CommentActionResult.Success => NoContent(),
                _ => BadRequest()
            };
        }

        [Authorize]
        [HttpDelete("api/comments/{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            var result = await _commentService.DeleteAsync(id, userId);

            return result switch
            {
                CommentActionResult.NotFound => NotFound(new { message = "Comment not found" }),
                CommentActionResult.Forbidden => Forbid(),
                CommentActionResult.Success => NoContent(),
                _ => BadRequest()
            };
        }
    }
}
