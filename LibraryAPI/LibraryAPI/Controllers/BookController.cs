using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryAPI.Models;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Cors;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;
        private readonly UserManager<User> _userManager;

        public BookController(DatabaseContext dbContext, UserManager<User> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Book>>> Get()
        {
            var books = await _dbContext.Books
            .Include(b => b.Author)
            .Include(b => b.Categories)
            .ToListAsync();

            var bookDtos = books.Select(book => new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                Author = book.Author.Name,
                Categories = book.Categories.Select(category => category.Category.Orientation).ToList()
            }).ToList();
            return Ok(bookDtos);
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult Get(int id)
        {
            var book = _dbContext.Books.Include(b => b.Categories).FirstOrDefault(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        [HttpDelete("{id}")]
        [Authorize("AdminOnly")]
        public IActionResult Delete(int id)
        {
            Console.WriteLine(id);
            Book? book = _dbContext.Books.Find(id);
            if (book != null)
            {
                _dbContext.Books.Remove(book);
                _dbContext.SaveChanges();
                return Ok("BookRemoved");
            }
            else
            {
                throw new ArgumentNullException();
            }
        }

        [HttpPost]
        [Authorize("AdminOnly")]
        public async Task<ActionResult<Book>> CreateAsync(CreateBook createBook)
        {
            Console.WriteLine(User.Identity.IsAuthenticated);
            if (User.IsInRole("Admin"))
            {
                var book = Book.FromCreateModel(createBook);
                foreach (var categoryId in createBook.CategoryIds)
                {
                    book.Categories.Add(new BookCategory
                    {
                        BookId = book.Id,
                        CategoryId = categoryId
                    });
                }
                await _dbContext.Books.AddAsync(book);
                await _dbContext.SaveChangesAsync();
                return await Task.FromResult(book);
            }
            return Unauthorized();
        }
    }

}