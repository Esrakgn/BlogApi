using BlogApi.Application.DTOs.Posts;
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

        public async Task<List<PostDto>> GetAllAsync()
        {
            var posts = await _context.Posts
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    AuthorId = p.AuthorId,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();

            return posts;
            // tüm postları dto olarak liste halinde döndürür
        }

        public async Task<PostDto?> GetByIdAsync(Guid id)
        {
            var post = await _context.Posts
                .Where(p => p.Id == id)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    AuthorId = p.AuthorId,
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

                var post = new Post
                {
                    Id = Guid.NewGuid(),
                    Title = dto.Title,
                    Content = dto.Content,
                    AuthorId = userId,
                    CreatedAt = DateTime.UtcNow
                };
                // yeni post oluşturuyoruz
                // authorId token'dan gelen kullanıcı id'si olacak

                _context.Posts.Add(post);
                // postu EF Core üzerinden ekliyoruz

                await _context.SaveChangesAsync();
                

                return new PostDto
                {
                    Id = post.Id,
                    Title = post.Title,
                    Content = post.Content,
                    AuthorId = post.AuthorId,
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

        public async Task<bool> UpdateAsync(Guid id, Guid userId, UpdatePostDto dto)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);
            // güncellenecek postu id'ye göre buluyoruz

            if (post == null)
            {
                return false;
                // post yoksa güncelleme yapılamaz
            }

            if (post.AuthorId != userId)
            {
                return false;
                // giriş yapan kullanıcı postun sahibi değilse güncelleme yapamaz
            }

            post.Title = dto.Title;
            post.Content = dto.Content;
            post.UpdatedAt = DateTime.UtcNow;
           
            await _context.SaveChangesAsync();
            
            return true;
            
        }

        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);
            // silinecek postu id'ye göre buluyoruz

            if (post == null)
            {
                return false;
                // post yoksa silme işlemi yapılamaz
            }

            if (post.AuthorId != userId)
            {
                return false;
                // giriş yapan kullanıcı postun sahibi değilse silme işlemi yapamaz
            }

            _context.Posts.Remove(post);
            // postu silinmek üzere işaretliyoruz

            await _context.SaveChangesAsync();

            return true;
            
        }
    }
}
