using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Domain;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Core.Services;

public class TodoListService : ITodoListService
{
    private readonly AppDbContext _context;

    public TodoListService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TodoList>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.TodoLists
            .OrderBy(list => list.CreateDate)
            .ToListAsync(ct);
    }

    public async Task<TodoList?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.TodoLists.FirstOrDefaultAsync(list => list.Id == id, ct);
    }

    public async Task<TodoList> CreateAsync(TodoList list, CancellationToken ct = default)
    {
        _context.TodoLists.Add(list);
        await _context.SaveChangesAsync(ct);
        return list;
    }

    public async Task<TodoList?> UpdateAsync(int id, string name, CancellationToken ct = default)
    {
        var list = await _context.TodoLists.FirstOrDefaultAsync(item => item.Id == id, ct);
        if (list is null)
        {
            return null;
        }

        list.Name = name;
        await _context.SaveChangesAsync(ct);
        return list;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var list = await _context.TodoLists.FirstOrDefaultAsync(item => item.Id == id, ct);
        if (list is null)
        {
            return false;
        }

        _context.TodoLists.Remove(list);
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
