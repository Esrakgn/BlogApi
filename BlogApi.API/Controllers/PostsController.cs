using BlogApi.Application.DTOs.Posts;
using BlogApi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BlogApi.Application.Enums;

namespace BlogApi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] Guid? categoryId)
        {
            var posts = await _postService.GetAllAsync(search, categoryId);
            return Ok(posts);
        }


        [HttpGet("{id:guid}")]
            public async Task<IActionResult> GetById(Guid id)
            {
                var post = await _postService.GetByIdAsync(id);

                if (post == null)
                {
                    return NotFound(new { message = "Post not found" });
                }

                return Ok(post);
            }

            [Authorize]
            [HttpPost]
            public async Task<IActionResult> Create(CreatePostDto dto)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var createdPost = await _postService.CreateAsync(userId, dto);
                return CreatedAtAction(nameof(GetById), new { id = createdPost.Id }, createdPost);
            }


            [Authorize]
            [HttpPut("{id:guid}")]
            public async Task<IActionResult> Update(Guid id, UpdatePostDto dto)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new {message = "Invalid user token" });

                }

                var result = await _postService.UpdateAsync(id, userId, dto);

            return result switch
            {
                PostActionResult.NotFound => NotFound(new { message = "Post not found" }),
                PostActionResult.Forbidden => Forbid(),
                PostActionResult.Success => NoContent(),
                _ => BadRequest()
            };


        }

        [Authorize]
            [HttpDelete("{id:guid}")]
            public async Task<IActionResult> Delete(Guid id)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if(!Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var result = await _postService.DeleteAsync(id, userId);

            return result switch
            {
                PostActionResult.NotFound => NotFound(new { message = "Post not found" }),
                PostActionResult.Forbidden => Forbid(),
                PostActionResult.Success => NoContent(),
                _ => BadRequest()
            };

        }

    }
}

