using BlogApi.Application.DTOs.Posts;
using System;
using System.Collections.Generic;
using System.Text;

namespace BlogApi.Application.Interfaces
{
    public interface IPostService
    {
        Task<List<PostDto>> GetAllAsync();
        Task<PostDto?> GetByIdAsync(Guid id);
        Task<PostDto> CreateAsync(Guid userId, CreatePostDto dto);
        Task<bool> UpdateAsync(Guid id, Guid userId, UpdatePostDto dto);
        Task<bool> DeleteAsync(Guid id, Guid userId);
    }
}