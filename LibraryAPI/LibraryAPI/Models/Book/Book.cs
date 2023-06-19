﻿using System.ComponentModel.DataAnnotations;
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

    [ForeignKey("AuthorId")]
    public int AuthorId { get; set; }
    public User Author { get; set; }
    private DateTime CreatedAt { get; set; }
    public List<BookCategory> Categories { get; set; }

    public static Book FromCreateModel(CreateBook createModel)
    {
        return new Book
        {
            CreatedAt = DateTime.UtcNow,
            Title = createModel.Title,
            Description = createModel.Description,
            AuthorId = createModel.AuthorId,
            Categories = new List<BookCategory>()
        };
    }

}

