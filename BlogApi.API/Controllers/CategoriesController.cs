using BlogApi.Application.DTOs.Categories;
using BlogApi.Application.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogApi.Application.Enums;


namespace BlogApi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IValidator<CreateCategoryDto> _createCategoryValidator;
        private readonly IValidator<UpdateCategoryDto> _updateCategoryValidator;

        public CategoriesController(
            ICategoryService categoryService,
            IValidator<CreateCategoryDto> createCategoryValidator,
            IValidator<UpdateCategoryDto> updateCategoryValidator)
        {
            _categoryService = categoryService;
            _createCategoryValidator = createCategoryValidator;
            _updateCategoryValidator = updateCategoryValidator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var category = await _categoryService.GetByIdAsync(id);

            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            return Ok(category);
        }


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            var validationResult = await _createCategoryValidator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                }));
            }

            try
            {
                var createdCategory = await _categoryService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = createdCategory.Id }, createdCategory);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryDto dto)
        {
            var validationResult = await _updateCategoryValidator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(x => new
                {
                    field = x.PropertyName,
                    error = x.ErrorMessage
                }));
            }

            var result = await _categoryService.UpdateAsync(id, dto);

            return result switch
            {
                CategoryActionResult.NotFound => NotFound(new { message = "Category not found" }),
                CategoryActionResult.Conflict => Conflict(new { message = "Category name already exists" }),
                CategoryActionResult.Success => NoContent(),
                _ => BadRequest()
            };


            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _categoryService.DeleteAsync(id);

            return result switch
            {
                CategoryActionResult.NotFound => NotFound(new { message = "Category not found" }),
                CategoryActionResult.Conflict => Conflict(new { message = "Category cannot be deleted because it is used by posts" }),
                CategoryActionResult.Success => NoContent(),
                _ => BadRequest()
            };

            return NoContent();
        }
    }
}
