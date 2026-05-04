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
        Task<PagedResult<PostDto>> GetAllAsync(string? search, Guid? categoryId, PostQueryParams queryParams);

        Task<PagedResult<PostDto>> GetMyPostsAsync(Guid userId, PostQueryParams queryParams);


        Task<PostDto?> GetByIdAsync(Guid id);
        Task<PostDto> CreateAsync(Guid userId, CreatePostDto dto);
        Task<PostActionResult> UpdateAsync(Guid id, Guid userId, bool isAdmin, UpdatePostDto dto);
        Task<PostActionResult> DeleteAsync(Guid id, Guid userId, bool isAdmin);

    }
}