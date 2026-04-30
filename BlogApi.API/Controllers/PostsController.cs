using BlogApi.Application.DTOs.Common;
using BlogApi.Application.DTOs.Posts;
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
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;
        private readonly IValidator<CreatePostDto> _createPostValidator;
        private readonly IValidator<UpdatePostDto> _updatePostValidator;
        private readonly IValidator<PostQueryParams> _postQueryParamsValidator;

        public PostsController(
            IPostService postService,
            IValidator<CreatePostDto> createPostValidator,
            IValidator<UpdatePostDto> updatePostValidator,
            IValidator<PostQueryParams> postQueryParamsValidator)
        {
            _postService = postService;
            _createPostValidator = createPostValidator;
            _updatePostValidator = updatePostValidator;
            _postQueryParamsValidator = postQueryParamsValidator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] Guid? categoryId,
            [FromQuery] PostQueryParams queryParams)
        {
            var validationResult = await _postQueryParamsValidator.ValidateAsync(queryParams);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                }));
            }

            var posts = await _postService.GetAllAsync(search, categoryId, queryParams);
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

        [Authorize(Roles = "Admin,Author")]
        [HttpPost]

        public async Task<IActionResult> Create(CreatePostDto dto)
        {
            var validationResult = await _createPostValidator.ValidateAsync(dto);

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

            var createdPost = await _postService.CreateAsync(userId, dto);
            return CreatedAtAction(nameof(GetById), new { id = createdPost.Id }, createdPost);
        }

        [Authorize(Roles = "Admin,Author")]
        [HttpPut("{id:guid}")]

        public async Task<IActionResult> Update(Guid id, UpdatePostDto dto)
        {
            var validationResult = await _updatePostValidator.ValidateAsync(dto);

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

            var isAdmin = User.IsInRole("Admin");

            var result = await _postService.UpdateAsync(id, userId, isAdmin, dto);

            return result switch
            {
                PostActionResult.NotFound => NotFound(new { message = "Post not found" }),
                PostActionResult.Forbidden => Forbid(),
                PostActionResult.Success => NoContent(),
                _ => BadRequest()
            };
        }

        [Authorize(Roles = "Admin,Author")]
        [HttpDelete("{id:guid}")]

        public async Task<IActionResult> Delete(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var isAdmin = User.IsInRole("Admin");

            var result = await _postService.DeleteAsync(id, userId, isAdmin);

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
