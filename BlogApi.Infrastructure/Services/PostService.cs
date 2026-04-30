using BlogApi.Application.DTOs.Posts;
using BlogApi.Application.Interfaces;
using BlogApi.Domain.Entities;
using BlogApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using BlogApi.Application.DTOs.Common;

using BlogApi.Application.Enums;

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
                    UpdatedAt = p.UpdatedAt
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
                .Where(p => p.Id == id)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    AuthorId = p.AuthorId,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .FirstOrDefaultAsync();

            return post;
            // id'ye göre tek post getirir / yoksa null döner
        }

        public async Task<PostDto> CreateAsync(Guid userId, CreatePostDto dto)
        {
            try
            {
                var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
                // giriş yapan kullanıcı database'de var mı kontrol ediyoruz

                if (!userExists)
                {
                    throw new Exception("User not found.");
                }

                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
                // gönderilen kategori database'de var mı kontrol ediyoruz

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
                // yeni post oluşturuyoruz
                // authorId token'dan gelen kullanıcı id'si olacak

                _context.Posts.Add(post);

                await _context.SaveChangesAsync();

                var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == post.CategoryId);
                // kayıt edilen postun kategori bilgisini alıyoruz

                return new PostDto
                {
                    Id = post.Id,
                    Title = post.Title,
                    Content = post.Content,
                    AuthorId = post.AuthorId,
                    CategoryId = post.CategoryId,
                    CategoryName = category?.Name ?? string.Empty,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt
                };
                // oluşturulan postu dto olarak geri döndürüyoruz
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<PostActionResult> UpdateAsync(Guid id, Guid userId, bool isAdmin, UpdatePostDto dto)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);
            // güncellenecek postu id'ye göre buluyoruz

            if (post == null)
            {
                return PostActionResult.NotFound;
            }

            if (!isAdmin && post.AuthorId != userId)
            {
                return PostActionResult.Forbidden;
                //giriş yapan kullanıcı admin değilse ve postun sahibi değilse güncellemeye izin yok
            }


            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            // gönderilen kategori database'de var mı kontrol ediyoruz

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
                //giriş yapan kullanıcı admin değilse ve postun sahibi değilse silemez 
            }


            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return PostActionResult.Success;
        }
    }
}
