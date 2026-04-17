using BlogApi.Application.DTOs.Categories;
using BlogApi.Application.Interfaces;
using BlogApi.Domain.Entities;
using BlogApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CategoryDto>> GetAllAsync()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();

            return categories;
        }

        public async Task<CategoryDto?> GetByIdAsync(Guid id)
        {
            var category = await _context.Categories
                .Where(c => c.Id == id)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .FirstOrDefaultAsync();

            return category;
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
        {
            var categoryExists = await _context.Categories.AnyAsync(c => c.Name == dto.Name);
            // aynı isimde kategori var mı kontrol ediyoruz

            if (categoryExists)
            {
                throw new Exception("Category already exists.");
            }

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = dto.Name
            };

            _context.Categories.Add(category);

            await _context.SaveChangesAsync();

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
            // oluşturulan kategoriyi dto olarak döndürüyoruz
        }

        public async Task<bool> UpdateAsync(Guid id, UpdateCategoryDto dto)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
            // güncellenecek kategoriyi buluyoruz

            if (category == null)
            {
                return false;
                // kategori yoksa işlem yapılamaz
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.Name == dto.Name && c.Id != id);
            // başka bir kategoride aynı isim var mı kontrol ediyoruz

            if (categoryExists)
            {
                return false;
                // aynı isimde başka kategori varsa güncelleme yapmıyoruz
            }

            category.Name = dto.Name;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return false;
            }

            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
