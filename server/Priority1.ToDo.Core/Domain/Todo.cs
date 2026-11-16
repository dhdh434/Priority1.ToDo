namespace Priority1.ToDo.Core.Domain;

using System.ComponentModel.DataAnnotations;

public class Todo : EntityBase
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public bool IsComplete { get; set; } = false;

    public DateTime? DueDate { get; set; }

    public int ListId { get; set; }

    public TodoList List { get; set; } = null!;
}
