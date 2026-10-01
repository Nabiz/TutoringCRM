using Microsoft.AspNetCore.Mvc;
using TutoringCRM.Application.Interfaces;
using TutoringCRM.Application.DTOs;

namespace TutoringCRM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IStudentsService _studentsService;
    private readonly ILessonsService _lessonsService;

    public StudentsController(IStudentsService studentsService, ILessonsService lessonsService)
    {
        _studentsService = studentsService;
        _lessonsService = lessonsService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var students = await _studentsService.GetAllStudentsAsync(cancellationToken);
        return Ok(students);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var student = await _studentsService.GetStudentByIdAsync(id, cancellationToken);
        
        if (student == null)
        {
            return NotFound();
        }

        return Ok(student);
    }

    [HttpGet("{id:int}/lessons")]
    public async Task<IActionResult> GetLessons(int id, CancellationToken cancellationToken)
    {
        var lessons = await _lessonsService.GetLessonsByStudentIdAsync(id, cancellationToken);
        return Ok(lessons);
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateStudentDto createStudentDto, CancellationToken cancellationToken)
    {
        var studentDto = await _studentsService.CreateStudentAsync(createStudentDto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = studentDto.Id }, studentDto);
    }
}
