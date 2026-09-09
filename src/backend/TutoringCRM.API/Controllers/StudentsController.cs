using Microsoft.AspNetCore.Mvc;
using TutoringCRM.Application.Interfaces;

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

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var student = _studentsService.GetStudentById(id);
        
        if (student == null)
        {
            return NotFound();
        }

        return Ok(student);
    }
}