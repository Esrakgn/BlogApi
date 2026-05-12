using BlogApi.Application.DTOs.Common;
using BlogApi.Application.DTOs.Posts;
using BlogApi.Application.Enums;
using BlogApi.Application.Interfaces;
using BlogApi.Domain.Entities;
using BlogApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Services
{
    public class PostService : IPostService
    {
        private readonly AppDbContext _context;

        public PostService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<PostDto>> GetAllAsync(string? search, Guid? categoryId, PostQueryParams queryParams)
        {
            var query = _context.Posts
                .Include(p => p.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p =>
                    EF.Functions.Like(p.Title, $"%{search}%") ||
                    EF.Functions.Like(p.Content, $"%{search}%"));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            query = queryParams.SortBy?.ToLower() switch
            {
                "oldest" => query.OrderBy(p => p.CreatedAt),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    AuthorId = p.AuthorId,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    ViewCount = p.ViewCount
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize);

            return new PagedResult<PostDto>
            {
                Items = items,
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };
        }

        public async Task<PostDto?> GetByIdAsync(Guid id)
        {
            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return null;
            }

            post.ViewCount++;
            await _context.SaveChangesAsync();

            return new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                AuthorId = post.AuthorId,
                CategoryId = post.CategoryId,
                CategoryName = post.Category.Name,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                ViewCount = post.ViewCount
            };
        }

        public async Task<PostDto> CreateAsync(Guid userId, CreatePostDto dto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                throw new Exception("User not found.");
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                throw new Exception("Category not found.");
            }

            var post = new Post
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Content = dto.Content,
                AuthorId = userId,
                CategoryId = dto.CategoryId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == post.CategoryId);

            return new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                AuthorId = post.AuthorId,
                CategoryId = post.CategoryId,
                CategoryName = category?.Name ?? string.Empty,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                ViewCount = post.ViewCount
            };
        }

        public async Task<PostActionResult> UpdateAsync(Guid id, Guid userId, bool isAdmin, UpdatePostDto dto)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return PostActionResult.NotFound;
            }

            if (!isAdmin && post.AuthorId != userId)
            {
                return PostActionResult.Forbidden;
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                return PostActionResult.NotFound;
            }

            post.Title = dto.Title;
            post.Content = dto.Content;
            post.CategoryId = dto.CategoryId;
            post.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return PostActionResult.Success;
        }

        public async Task<PostActionResult> DeleteAsync(Guid id, Guid userId, bool isAdmin)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return PostActionResult.NotFound;
            }

            if (!isAdmin && post.AuthorId != userId)
            {
                return PostActionResult.Forbidden;
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return PostActionResult.Success;
        }

        public async Task<PagedResult<PostDto>> GetMyPostsAsync(Guid userId, PostQueryParams queryParams)
        {
            var query = _context.Posts
                .Include(p => p.Category)
                .Where(p => p.AuthorId == userId)
                .AsQueryable();

            query = queryParams.SortBy?.ToLower() switch
            {
                "oldest" => query.OrderBy(p => p.CreatedAt),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    AuthorId = p.AuthorId,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    ViewCount = p.ViewCount
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalCount / queryParams.PageSize);

            return new PagedResult<PostDto>
            {
                Items = items,
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };
        }
    }
}
