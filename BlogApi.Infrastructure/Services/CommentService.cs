using BlogApi.Application.DTOs.Comments;
using BlogApi.Application.Enums;
using BlogApi.Application.Interfaces;
using BlogApi.Domain.Entities;
using BlogApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Services
{
    public class CommentService : ICommentService
    {
        private readonly AppDbContext _context;

        public CommentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CommentDto>> GetByPostIdAsync(Guid postId)
        {
            var comments = await _context.Comments
                .Where(c => c.PostId == postId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    PostId = c.PostId,
                    UserId = c.UserId,
                    UserName = c.User.FullName,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return comments;
        }

        public async Task<CommentDto> CreateAsync(Guid postId, Guid userId, CreateCommentDto dto)
        {
            var postExists = await _context.Posts.AnyAsync(p => p.Id == postId);

            if (!postExists)
            {
                throw new Exception("Post not found.");
            }

            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);

            if (!userExists)
            {
                throw new Exception("User not found.");
            }

            var comment = new Comment
            {
                Id = Guid.NewGuid(),
                Content = dto.Content,
                PostId = postId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                PostId = comment.PostId,
                UserId = comment.UserId,
                UserName = user?.FullName ?? string.Empty,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt
            };
        }

        public async Task<CommentActionResult> UpdateAsync(Guid commentId, Guid userId, UpdateCommentDto dto)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId);

            if (comment == null)
            {
                return CommentActionResult.NotFound;
            }

            if (comment.UserId != userId)
            {
                return CommentActionResult.Forbidden;
            }

            comment.Content = dto.Content;
            comment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return CommentActionResult.Success;
        }

        public async Task<CommentActionResult> DeleteAsync(Guid commentId, Guid userId)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId);

            if (comment == null)
            {
                return CommentActionResult.NotFound;
            }

            if (comment.UserId != userId)
            {
                return CommentActionResult.Forbidden;
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return CommentActionResult.Success;
        }
    }
}
