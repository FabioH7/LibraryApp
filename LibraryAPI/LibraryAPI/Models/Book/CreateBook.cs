using Microsoft.AspNetCore.Http;
namespace LibraryAPI.Models;

public class CreateBook
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int AuthorId { get; set; }
    public string CreatedBy { get; set; }
    public List<int> CategoryIds { get; set; }
    public IFormFile Cover { get; set; } // New property for the uploaded image file
}

