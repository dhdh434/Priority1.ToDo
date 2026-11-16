using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models;

/// <summary>Represents a to-do list returned by the API.</summary>
public sealed record TodoListResponse(int Id, string Name)
{
    public static TodoListResponse From(TodoList list) => new(list.Id, list.Name);
}
