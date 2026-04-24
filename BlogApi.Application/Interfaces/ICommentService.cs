using System;
using BlogApi.Application.DTOs.Comments;
using BlogApi.Application.Enums;

namespace BlogApi.Application.Interfaces
{
    public interface ICommentService
    {
        Task<List<CommentDto>> GetByPostIdAsync(Guid postId);
        Task<CommentDto> CreateAsync(Guid postId, Guid userId, CreateCommentDto dto);
        Task<CommentActionResult> UpdateAsync(Guid commentId, Guid userId, UpdateCommentDto dto);
        Task<CommentActionResult> DeleteAsync(Guid commentId, Guid userId);
    }
}
