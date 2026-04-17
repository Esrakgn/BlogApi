using BlogApi.Application.DTOs.Posts;
using BlogApi.Application.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.Interfaces
{
    public interface IPostService
    {
        Task<List<PostDto>> GetAllAsync(string? search, Guid? categoryId);
        Task<PostDto?> GetByIdAsync(Guid id);
        Task<PostDto> CreateAsync(Guid userId, CreatePostDto dto);
        Task<PostActionResult> UpdateAsync(Guid id, Guid userId, UpdatePostDto dto);
        Task<PostActionResult> DeleteAsync(Guid id, Guid userId);
    }
}