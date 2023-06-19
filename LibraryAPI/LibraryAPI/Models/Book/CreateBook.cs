using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace LibraryAPI.Models;

public class CreateBook
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int AuthorId { get; set; }
    public List<int> CategoryIds { get; set; }
}

