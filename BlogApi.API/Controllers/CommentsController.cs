using BlogApi.Application.DTOs.Comments;
using BlogApi.Application.Enums;
using BlogApi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogApi.API.Controllers
{
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

            var result = await _commentService.UpdateAsync(id, userId, dto);

            return result switch
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
