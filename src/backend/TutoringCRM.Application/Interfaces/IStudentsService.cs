using System.Collections.Generic;
using TutoringCRM.Application.DTOs;

namespace TutoringCRM.Application.Interfaces;

public interface IStudentsService
{
    IEnumerable<StudentDto> GetAllStudents();
    StudentDto? GetStudentById(string id);
}