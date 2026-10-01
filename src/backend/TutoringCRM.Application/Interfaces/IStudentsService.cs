using System.Collections.Generic;
using TutoringCRM.Application.DTOs;

namespace TutoringCRM.Application.Interfaces;

public interface IStudentsService
{
    Task<IEnumerable<StudentDto>> GetAllStudentsAsync(CancellationToken cancellationToken = default);
    Task<StudentDto?> GetStudentByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<StudentDto> CreateStudentAsync(CreateStudentDto createStudentDto, CancellationToken cancellationToken = default);
}
