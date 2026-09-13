using System.Collections.Generic;
using TutoringCRM.Application.DTOs;

namespace TutoringCRM.Application.Interfaces;

public interface IStudentsService
{
    IEnumerable<StudentDto> GetAllStudents();
    StudentDto? GetStudentById(int id);
    Task<StudentDto> CreateStudentAsync(CreateStudentDto createStudentDto);
}