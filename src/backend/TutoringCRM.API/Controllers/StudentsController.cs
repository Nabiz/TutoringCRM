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
    public IActionResult Get()
    {
        var students = _studentsService.GetAllStudents();
        return Ok(students);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var student = _studentsService.GetStudentById(id);
        
        if (student == null)
        {
            return NotFound();
        }

        return Ok(student);
    }

    [HttpGet("{id:int}/lessons")]
    public IActionResult GetLessons(int id)
    {
        var lessons = _lessonsService.GetLessonsByStudentId(id);
        return Ok(lessons);
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateStudentDto createStudentDto)
    {
        var studentDto = await _studentsService.CreateStudentAsync(createStudentDto);
        return CreatedAtAction(nameof(GetById), new { id = studentDto.Id }, studentDto);
    }
}