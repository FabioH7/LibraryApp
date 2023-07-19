using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace LibraryAPI.Models;

[Table("Categories")]
public class Category
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Priority { get; set; }
    public bool Premium { get; set; }
    public string CreatedBy { get; set; }
    public List<BookCategory> Books { get; set; }
    public string CreatedAt { get; set; }
}

