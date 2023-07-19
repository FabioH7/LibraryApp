using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace LibraryAPI.Models;

[Table("Books")]
public class Book
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public string CreatedBy { get; set; }

    [ForeignKey("AuthorId")]
    public int AuthorId { get; set; }
    public User Author { get; set; }
    public string CreatedAt { get; set; }
    public List<BookCategory> Categories { get; set; }
}

