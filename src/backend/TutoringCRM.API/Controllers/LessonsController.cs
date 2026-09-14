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
    public IActionResult Get()
    {
        var lessons = _lessonsService.GetAllLessons();
        return Ok(lessons);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var lesson = _lessonsService.GetLessonById(id);

        if (lesson == null)
        {
            return NotFound();
        }

        return Ok(lesson);
    }

    [HttpPost]
    public async Task<ActionResult<LessonDto>> CreateLesson([FromBody] CreateLessonDto createLessonDto)
    {
        var lessonDto = await _lessonsService.CreateLessonAsync(createLessonDto);
        return CreatedAtAction(nameof(GetById), new { id = lessonDto.Id }, lessonDto);
    }
}
