using System.Collections.Generic;
using System.Linq;
using TutoringCRM.Application.DTOs;
using TutoringCRM.Application.Interfaces;
using TutoringCRM.Domain.Interfaces;
using TutoringCRM.Domain.Entities;

namespace TutoringCRM.Application.Services;

public class StudentsService : IStudentsService
{
    private readonly IStudentsRepository _studentsRepository;

    public StudentsService(IStudentsRepository studentsRepository)
    {
        _studentsRepository = studentsRepository;
    }

    public async Task<IEnumerable<StudentDto>> GetAllStudentsAsync(CancellationToken cancellationToken = default)
    {
        var students = await _studentsRepository.GetAllAsync(cancellationToken);

        return students.Select(student => new StudentDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Grade = student.Grade
        });
    }

    public async Task<StudentDto?> GetStudentByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var student = await _studentsRepository.GetByIdAsync(id, cancellationToken);

        if (student == null)
        {
            return null;
        }

        return new StudentDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Grade = student.Grade
        };
    }

    public async Task<StudentDto> CreateStudentAsync(CreateStudentDto createDto, CancellationToken cancellationToken = default)
    {
        var student = new Student
        {
            Id = 0,
            FirstName = createDto.FirstName,
            LastName = createDto.LastName,
            Grade = createDto.Grade
        };

        await _studentsRepository.AddAsync(student, cancellationToken);

        return new StudentDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Grade = student.Grade
        };
    }
}
