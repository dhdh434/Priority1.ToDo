using System.ComponentModel.DataAnnotations;

namespace Priority1.ToDo.Api.Models.Requests;

/// <summary>Payload for creating a to-do list.</summary>
public sealed record CreateTodoListRequest
{
    [Required, MaxLength(100)]
    public required string Name { get; init; }
}
