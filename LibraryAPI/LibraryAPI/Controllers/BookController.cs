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
            .ToListAsync();

            var bookDtos = books.Select(book => new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                Author = book.Author.Name,
                Categories = book.Categories.Select(category => category.Category.Name).ToList()
            }).ToList();
            return Ok(bookDtos);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var book = _dbContext.Books.Include(b => b.Categories).FirstOrDefault(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }
            var bookDto = new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                Author = book.Author.Name,
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
        public async Task<ActionResult<Book>> CreateAsync(CreateBook createBook)
        {

            var book = _dbContext.Books.Where(b => b.Title == createBook.Title);
            if (book != null)
            {
                return Conflict("A book with the same title already exists."); ;
            }

            // Process the image file
            if (createBook.Cover != null && createBook.Cover.Length > 0)
            {
                // Generate a unique file name for the image
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + createBook.Cover.FileName;

                // Define the path where the image will be saved
                string imagePath = Path.Combine("images", uniqueFileName);

                // Save the image to the file system
                using (var fileStream = new FileStream(imagePath, FileMode.Create))
                {
                    await createBook.Cover.CopyToAsync(fileStream);
                }

                // Set the image URL for the book
                var imageUrl = imagePath;
            }
            Book newBook = new Book { Title = createBook.Title, Description = createBook.Description, AuthorId = createBook.AuthorId, Categories = new List<BookCategory>() };
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
        public async Task<ActionResult<Book>> Put(int id, CreateBook createBook)
        {
            // Check if the user is an admin

            var book = await _dbContext.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            book.Title = createBook.Title;
            book.Description = createBook.Description;
            book.AuthorId = createBook.AuthorId;

            _dbContext.BookCategories.RemoveRange(book.Categories);

            foreach (var categoryId in createBook.CategoryIds)
            {
                book.Categories.Add(new BookCategory
                {
                    BookId = book.Id,
                    CategoryId = categoryId
                });
            }
            await _dbContext.SaveChangesAsync();

            return book;
        }
    }
}