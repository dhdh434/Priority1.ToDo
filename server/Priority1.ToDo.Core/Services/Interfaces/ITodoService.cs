using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Services.Interfaces;

public interface ITodoService
{
    Task<List<Todo>?> GetAllAsync(int listId, CancellationToken ct = default);

    Task<Todo?> GetByIdAsync(int listId, int id, CancellationToken ct = default);

    Task<Todo?> CreateAsync(int listId, Todo itemToCreate, CancellationToken ct = default);

    Task<Todo?> UpdateAsync(int listId, Todo itemToUpdate, CancellationToken ct = default);

    Task<bool> DeleteAsync(int listId, int id, CancellationToken ct = default);
}
