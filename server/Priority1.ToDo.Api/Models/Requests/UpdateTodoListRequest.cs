using System.ComponentModel.DataAnnotations;

namespace Priority1.ToDo.Api.Models.Requests;

/// <summary>Payload for renaming a to-do list.</summary>
public sealed record UpdateTodoListRequest
{
    [Required, MaxLength(100)]
    public required string Name { get; init; }
}
