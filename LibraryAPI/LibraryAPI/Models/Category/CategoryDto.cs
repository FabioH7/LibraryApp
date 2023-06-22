using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace LibraryAPI.Models;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Priority { get; set; }
}

