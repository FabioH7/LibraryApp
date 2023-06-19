using Microsoft.AspNetCore.Authorization;
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
            return await _dbContext.Categories.ToListAsync();
        }

        [HttpGet("{id}")]
        public Category Get(int id)
        {
            return _dbContext.Categories.Find(id);
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
            var newCategory = Category.FromCreateModel(category);
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
                return NotFound();
            }
            category.Orientation = updatedCategory.Orientation;
            await _dbContext.SaveChangesAsync();
            return await Task.FromResult(category);
        }
    }

}