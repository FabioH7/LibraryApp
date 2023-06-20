using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
namespace LibraryAPI.Models;

[Table("Users")]
public class User : IdentityUser<int>
{
    public string Name { get; set; }
    public string Surname { get; set; }
    public string? Bio { get; set; }
    [ForeignKey("Role")]
    public int RoleId { get; set; }
    public Role Role { get; set; }
    private DateTime CreatedAt { get; set; }
    public ICollection<Book> Books { get; set; }
}

