using BlogApi.Application.DTOs.Posts;
using BlogApi.Application.Enums;
using BlogApi.Application.DTOs.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.Interfaces
{
    public interface IPostService
    {
        Task<PagedResult<PostDto>> GetAllAsync(string? search, Guid? categoryId, PaginationParams paginationParams);

        Task<PostDto?> GetByIdAsync(Guid id);
        Task<PostDto> CreateAsync(Guid userId, CreatePostDto dto);
        Task<PostActionResult> UpdateAsync(Guid id, Guid userId, UpdatePostDto dto);
        Task<PostActionResult> DeleteAsync(Guid id, Guid userId);
    }
}