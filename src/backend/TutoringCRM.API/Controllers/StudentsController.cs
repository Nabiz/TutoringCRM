using Microsoft.AspNetCore.Mvc;
using TutoringCRM.Application.Interfaces;
using TutoringCRM.Application.DTOs;

namespace TutoringCRM.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IStudentsService _studentsService;

    public StudentsController(IStudentsService studentsService)
    {
        _studentsService = studentsService;
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

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateStudentDto createStudentDto)
    {
        var studentDto = await _studentsService.CreateStudentAsync(createStudentDto);
        return CreatedAtAction(nameof(GetById), new { id = studentDto.Id }, studentDto);
    }
}