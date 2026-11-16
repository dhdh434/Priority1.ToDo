using Microsoft.AspNetCore.Mvc;
using Priority1.ToDo.Api.Models;
using Priority1.ToDo.Api.Models.Requests;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Api.Controllers;

[ApiController]
[Route("lists/{listId:int}/todos")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodosController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TodoItem>>> GetAll(int listId, CancellationToken ct)
    {
        var todos = await _todoService.GetAllAsync(listId, ct);
        return todos is null ? NotFound() : Ok(todos.Select(TodoItem.From).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoItem>> GetById(int listId, int id, CancellationToken ct)
    {
        var todo = await _todoService.GetByIdAsync(listId, id, ct);
        return todo is null ? NotFound() : Ok(TodoItem.From(todo));
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> Create(int listId, [FromBody] CreateTodoRequest request, CancellationToken ct)
    {
        var created = await _todoService.CreateAsync(listId, request.ToModel(), ct);
        return created is null
            ? NotFound()
            : CreatedAtAction(nameof(GetById), new { listId, id = created.Id }, TodoItem.From(created));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TodoItem>> Update(int listId, int id, [FromBody] UpdateTodoRequest request, CancellationToken ct)
    {
        var updated = await _todoService.UpdateAsync(listId, request.ToModel(id), ct);
        return updated is null ? NotFound() : Ok(TodoItem.From(updated));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int listId, int id, CancellationToken ct)
    {
        var deleted = await _todoService.DeleteAsync(listId, id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
