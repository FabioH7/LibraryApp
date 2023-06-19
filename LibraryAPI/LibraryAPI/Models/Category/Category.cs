using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace LibraryAPI.Models;

[Table("Categories")]
public class Category
{
    [Key]
    public int Id { get; set; }

    public string Orientation { get; set; }

    public List<BookCategory> Books { get; set; }
    private DateTime CreatedAt { get; set; }
    public static Category FromCreateModel(CreateCategory createModel)
    {
        return new Category
        {
            CreatedAt = DateTime.UtcNow,
            Orientation = createModel.Orientation
        };
    }
}

