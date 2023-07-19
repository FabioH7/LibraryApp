﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryAPI.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public CategoryController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> Get()
        {
            var categories = await _dbContext.Categories.ToListAsync();
            var categoryDtos = categories.Select(category => new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Priority = category.Priority,
                Premium = category.Premium,
                CreatedBy = category.CreatedBy,
                CreatedAt = category.CreatedAt
            }).ToList();
            return Ok(categoryDtos);
        }

        [HttpGet("{id}")]
        public ActionResult<Category> Get(int id)
        {
            var category = _dbContext.Categories.Find(id);
            if (category == null)
            {
                return NotFound("Category not found");
            }
            var catDto = new CategoryDto {Id = category.Id,
                Name = category.Name,
                Priority = category.Priority,
                Premium = category.Premium,
                CreatedBy = category.CreatedBy,
                CreatedAt = category.CreatedAt };
            return Ok(category);
        }

        [HttpGet("premium")]
        public async Task<ActionResult<IEnumerable<Category>>> GetByPremium()
        {
            var categories = await _dbContext.Categories.Where(c => c.Premium == true).ToListAsync();
            var categoryDtos = categories.Select(category => new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Priority = category.Priority,
                Premium = category.Premium,
                CreatedBy = category.CreatedBy,
                CreatedAt = category.CreatedAt
            }).ToList();
            return Ok(categoryDtos);
        }

        [HttpDelete("{id}")]
        [Authorize("AdminOnly")]
        public Category Delete(int id)
        {
            Category? category = _dbContext.Categories.Find(id);
            if (category != null)
            {
                _dbContext.Categories.Remove(category);
                _dbContext.SaveChanges();
                return category;
            }
            else
            {
                throw new ArgumentNullException();
            }
        }

        [HttpPost]
        [Authorize("AdminOnly")]
        public async Task<ActionResult<Category>> Post(CreateCategory category)
        {
            var existingCategory = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Name == category.Name);
            if (existingCategory != null)
            {
                return Conflict("Category with the same name already exists.");
            }
            string createdAt = DateTime.Now.ToString("MM/dd/yyyy H:mm");
            var newCategory = new Category { Name = category.Name, Priority = category.Priority, CreatedAt = createdAt, CreatedBy = category.CreatedBy, Premium = category.Premium};
            await _dbContext.Categories.AddAsync(newCategory);
            await _dbContext.SaveChangesAsync();
            return await Task.FromResult(newCategory);
        }

        [HttpPut("{id}")]
        [Authorize("AdminOnly")]
        public async Task<ActionResult<Category>> Put(int id, CreateCategory updatedCategory)
        {
            var category = _dbContext.Categories.FirstOrDefault(b => b.Id == id);
            if (category == null)
            {
                return NotFound("Category not found!");
            }
            category.Name = updatedCategory.Name;
            category.Priority = updatedCategory.Priority;
            category.CreatedBy = updatedCategory.CreatedBy;
            category.Premium = updatedCategory.Premium;
            await _dbContext.SaveChangesAsync();
            return await Task.FromResult(category);
        }
    }

}