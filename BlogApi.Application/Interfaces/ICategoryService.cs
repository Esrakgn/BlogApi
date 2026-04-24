using BlogApi.Application.DTOs.Categories;
using BlogApi.Application.Enums;
using System;


namespace BlogApi.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllAsync();
        Task<CategoryDto?> GetByIdAsync(Guid id);
        Task<CategoryDto> CreateAsync(CreateCategoryDto dto);
        Task<CategoryActionResult> UpdateAsync(Guid id, UpdateCategoryDto dto);
        Task<CategoryActionResult> DeleteAsync(Guid id);
    }
}
