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
        public async Task<ActionResult<IEnumerable<Book>>> Get()
        {
            var books = await _dbContext.Books
            .Include(b => b.Author)
            .Include(b => b.Categories)
            .ThenInclude(bc => bc.Category)
            .ToListAsync();

            var bookDtos = books.Select(book => new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                Author = book.Author.Name + ' ' + book.Author.Surname,
                ImageUrl = book.ImageUrl,
                Categories = book.Categories.Select(category => category.Category.Name).ToList()
            }).ToList();
            return Ok(bookDtos);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var book = _dbContext.Books.Include(b => b.Author)
            .Include(b => b.Categories)
            .ThenInclude(bc => bc.Category).FirstOrDefault(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }
            var bookDto = new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                Author = book.Author.Name + ' ' + book.Author.Surname,
                ImageUrl = book.ImageUrl,
                Categories = book.Categories.Select(category => category.Category.Name).ToList()
            };
            return Ok(bookDto);
        }

        [HttpDelete("{id}")]
        [Authorize]
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
        [Authorize]
        public async Task<ActionResult<Book>> CreateAsync([FromForm] CreateBook createBook)
        {
            var imageUrl = "";
            if (createBook.Cover != null && createBook.Cover.Length > 0)
            {
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + createBook.Cover.FileName;
                string imagePath = Path.Combine("images", uniqueFileName);
                using (var fileStream = new FileStream(imagePath, FileMode.Create))
                {
                    await createBook.Cover.CopyToAsync(fileStream);
                }
                imageUrl = imagePath;
            }
            Book newBook = new Book { Title = createBook.Title, ImageUrl = imageUrl, Description = createBook.Description, AuthorId = createBook.AuthorId, Categories = new List<BookCategory>() };
            foreach (var categoryId in createBook.CategoryIds)
            {
                newBook.Categories.Add(new BookCategory
                {
                    BookId = newBook.Id,
                    CategoryId = categoryId
                });
            }
            await _dbContext.Books.AddAsync(newBook);
            await _dbContext.SaveChangesAsync();
            return await Task.FromResult(newBook);
        }

        [HttpPut("{id}")]
        [Authorize("AdminOnly")]
        public async Task<ActionResult<BookDto>> Put(int id, [FromForm] CreateBook createBook)
        {
            var book = await _dbContext.Books
                .Include(b => b.Author)
                .Include(b => b.Categories)
                .ThenInclude(bc => bc.Category)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            var imageUrl = "";
            if (createBook.Cover != null && createBook.Cover.Length > 0)
            {
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + createBook.Cover.FileName;
                string imagePath = Path.Combine("images", uniqueFileName);
                using (var fileStream = new FileStream(imagePath, FileMode.Create))
                {
                    await createBook.Cover.CopyToAsync(fileStream);
                }
                imageUrl = imagePath;
            }

            book.Title = createBook.Title;
            book.ImageUrl = imageUrl;
            book.Description = createBook.Description;
            book.AuthorId = createBook.AuthorId;

            // Update book categories
            if (createBook.CategoryIds != null)
            {
                // Clear existing categories
                book.Categories.Clear();

                // Add new categories
                foreach (var categoryId in createBook.CategoryIds)
                {
                    var category = await _dbContext.Categories.FindAsync(categoryId);
                    if (category != null)
                    {
                        book.Categories.Add(new BookCategory
                        {
                            BookId = book.Id,
                            CategoryId = categoryId
                        });
                    }
                }
            }

            await _dbContext.SaveChangesAsync();
            var author = _dbContext.Users.FirstOrDefault(u => u.Id == book.AuthorId);
            var bookDto = new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                Author = author.Name + ' ' + author.Surname,
                ImageUrl = book.ImageUrl,
                Categories = book.Categories?.Select(category => category.Category?.Name).ToList()
            };

            return bookDto;
        }

    }
}