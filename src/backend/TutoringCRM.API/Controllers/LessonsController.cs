using Microsoft.AspNetCore.Mvc;
using TutoringCRM.Application.DTOs;
using TutoringCRM.Application.Interfaces;

namespace TutoringCRM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonsController : ControllerBase
{
    private readonly ILessonsService _lessonsService;

    public LessonsController(ILessonsService lessonsService)
    {
        _lessonsService = lessonsService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var lessons = await _lessonsService.GetAllLessonsAsync(cancellationToken);
        return Ok(lessons);
    }

    [HttpGet("range")]
    public async Task<ActionResult<IEnumerable<LessonDto>>> GetByDateRange(
        [FromQuery] DateTimeOffset from,
        [FromQuery] DateTimeOffset to,
        CancellationToken cancellationToken)
    {
        var lessons = await _lessonsService.GetLessonsByDateRangeAsync(
            from, to, cancellationToken);
        return Ok(lessons);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var lesson = await _lessonsService.GetLessonByIdAsync(id, cancellationToken);

        if (lesson == null)
        {
            return NotFound();
        }

        return Ok(lesson);
    }

    [HttpPost]
    public async Task<ActionResult<LessonDto>> CreateLesson([FromBody] CreateLessonDto createLessonDto, CancellationToken cancellationToken)
    {
        var lessonDto = await _lessonsService.CreateLessonAsync(createLessonDto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = lessonDto.Id }, lessonDto);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<LessonDto>> UpdateLesson(int id, [FromBody] LessonDto updateLessonDto, CancellationToken cancellationToken)
    {
        var updatedLesson = await _lessonsService.UpdateLessonAsync(id, updateLessonDto, cancellationToken);
        return Ok(updatedLesson);
    }

    [HttpPost("{id:int}/confirm-payment")]
    public async Task<ActionResult<LessonDto>> ConfirmPayment(int id, CancellationToken cancellationToken)
    {
        var confirmedLesson = await _lessonsService.ConfirmPaymentAsync(id, cancellationToken);
        return Ok(confirmedLesson);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteLesson(int id, CancellationToken cancellationToken)
    {
        await _lessonsService.DeleteLessonAsync(id, cancellationToken);
        return NoContent();
    }
}
