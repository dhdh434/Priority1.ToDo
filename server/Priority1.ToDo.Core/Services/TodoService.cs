using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Services.Interfaces;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Services;

public class TodoService : ITodoService
{
    private readonly AppDbContext _context;

    public TodoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Todo>?> GetAllAsync(int listId, CancellationToken ct = default)
    {
        if (!await _context.TodoLists.AnyAsync(list => list.Id == listId, ct))
        {
            return null;
        }

        return await _context.Todos.Where(todo => todo.ListId == listId).ToListAsync(ct);
    }

    public async Task<Todo?> GetByIdAsync(int listId, int id, CancellationToken ct = default)
    {
        return await _context.Todos.FirstOrDefaultAsync(
            todo => todo.ListId == listId && todo.Id == id, ct);
    }

    public async Task<Todo?> CreateAsync(int listId, Todo itemToCreate, CancellationToken ct = default)
    {
        if (!await _context.TodoLists.AnyAsync(list => list.Id == listId, ct))
        {
            return null;
        }

        itemToCreate.ListId = listId;
        _context.Todos.Add(itemToCreate);
        await _context.SaveChangesAsync(ct);
        return itemToCreate;
    }

    public async Task<Todo?> UpdateAsync(int listId, Todo itemToUpdate, CancellationToken ct = default)
    {
        var todo = await _context.Todos.FirstOrDefaultAsync(
            item => item.ListId == listId && item.Id == itemToUpdate.Id, ct);
        if (todo is null)
        {
            return null;
        }

        todo.Title = itemToUpdate.Title;
        todo.IsComplete = itemToUpdate.IsComplete;
        todo.DueDate = itemToUpdate.DueDate;

        await _context.SaveChangesAsync(ct);
        return todo;
    }

    public async Task<bool> DeleteAsync(int listId, int id, CancellationToken ct = default)
    {
        var todo = await _context.Todos.FirstOrDefaultAsync(
            item => item.ListId == listId && item.Id == id, ct);
        if (todo is null)
        {
            return false;
        }

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
