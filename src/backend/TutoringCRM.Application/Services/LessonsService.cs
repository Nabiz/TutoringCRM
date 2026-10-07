using System.Collections.Generic;
using System.Linq;
using TutoringCRM.Application.DTOs;
using TutoringCRM.Application.Interfaces;
using TutoringCRM.Domain.Entities;
using TutoringCRM.Domain.Interfaces;

namespace TutoringCRM.Application.Services;

public class LessonsService : ILessonsService
{
    private readonly ILessonsRepository _lessonsRepository;

    public LessonsService(ILessonsRepository lessonsRepository)
    {
        _lessonsRepository = lessonsRepository;
    }

    public async Task<IEnumerable<LessonDto>> GetAllLessonsAsync(CancellationToken cancellationToken = default)
    {
        var lessons = await _lessonsRepository.GetAllAsync(cancellationToken);

        return lessons.Select(lesson => new LessonDto
        {
            Id = lesson.Id,
            Date = lesson.Date,
            DurationInMinutes = lesson.DurationInMinutes,
            Mode = lesson.Mode,
            IsPaid = lesson.IsPaid,
            StudentId = lesson.StudentId
        });
    }

    public async Task<IEnumerable<LessonDto>> GetLessonsByDateRangeAsync(
        DateTimeOffset from, DateTimeOffset to, CancellationToken cancellationToken = default)
    {
        var lessons = await _lessonsRepository.GetByDateRangeAsync(
            from.UtcDateTime, to.UtcDateTime, cancellationToken);

        return lessons.Select(lesson => new LessonDto
        {
            Id = lesson.Id,
            Date = lesson.Date,
            DurationInMinutes = lesson.DurationInMinutes,
            Mode = lesson.Mode,
            IsPaid = lesson.IsPaid,
            StudentId = lesson.StudentId
        });
    }

    public async Task<IEnumerable<LessonDto>> GetLessonsByStudentIdAsync(int studentId, CancellationToken cancellationToken = default)
    {
        var lessons = await _lessonsRepository.GetByStudentIdAsync(studentId, cancellationToken);

        return lessons.Select(lesson => new LessonDto
        {
            Id = lesson.Id,
            Date = lesson.Date,
            DurationInMinutes = lesson.DurationInMinutes,
            Mode = lesson.Mode,
            IsPaid = lesson.IsPaid,
            StudentId = lesson.StudentId
        });
    }

    public async Task<LessonDto?> GetLessonByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var lesson = await _lessonsRepository.GetByIdAsync(id, cancellationToken);

        if (lesson == null)
        {
            return null;
        }

        return new LessonDto
        {
            Id = lesson.Id,
            Date = lesson.Date,
            DurationInMinutes = lesson.DurationInMinutes,
            Mode = lesson.Mode,
            IsPaid = lesson.IsPaid,
            StudentId = lesson.StudentId
        };
    }

    public async Task<LessonDto> CreateLessonAsync(CreateLessonDto createDto, CancellationToken cancellationToken = default)
    {
        var lesson = new Lesson
        {
            Id = 0,
            Date = createDto.Date,
            DurationInMinutes = createDto.DurationInMinutes,
            Mode = createDto.Mode,
            IsPaid = createDto.IsPaid,
            StudentId = createDto.StudentId
        };

        await _lessonsRepository.AddAsync(lesson, cancellationToken);

        return new LessonDto
        {
            Id = lesson.Id,
            Date = lesson.Date,
            DurationInMinutes = lesson.DurationInMinutes,
            Mode = lesson.Mode,
            IsPaid = lesson.IsPaid,
            StudentId = lesson.StudentId
        };
    }

    public async Task<LessonDto> UpdateLessonAsync(int id, LessonDto updateLessonDto, CancellationToken cancellationToken = default)
    {
        var existingLesson = await _lessonsRepository.GetByIdAsync(id, cancellationToken);

        if (existingLesson == null)
        {
            throw new KeyNotFoundException($"Lesson with ID {id} not found.");
        }

        existingLesson.Date = updateLessonDto.Date;
        existingLesson.DurationInMinutes = updateLessonDto.DurationInMinutes;
        existingLesson.Mode = updateLessonDto.Mode;
        existingLesson.IsPaid = updateLessonDto.IsPaid;
        existingLesson.StudentId = updateLessonDto.StudentId;

        await _lessonsRepository.UpdateAsync(existingLesson, cancellationToken);

        return new LessonDto
        {
            Id = existingLesson.Id,
            Date = existingLesson.Date,
            DurationInMinutes = existingLesson.DurationInMinutes,
            Mode = existingLesson.Mode,
            IsPaid = existingLesson.IsPaid,
            StudentId = existingLesson.StudentId
        };
    }

    public async Task<LessonDto> ConfirmPaymentAsync(int id, CancellationToken cancellationToken = default)
    {
        var existingLesson = await _lessonsRepository.GetByIdAsync(id, cancellationToken);

        if (existingLesson == null)
        {
            throw new KeyNotFoundException($"Lesson with ID {id} not found.");
        }

        existingLesson.IsPaid = true;

        await _lessonsRepository.UpdateAsync(existingLesson, cancellationToken);

        return new LessonDto
        {
            Id = existingLesson.Id,
            Date = existingLesson.Date,
            DurationInMinutes = existingLesson.DurationInMinutes,
            Mode = existingLesson.Mode,
            IsPaid = existingLesson.IsPaid,
            StudentId = existingLesson.StudentId
        };
    }

    public Task DeleteLessonAsync(int id, CancellationToken cancellationToken = default)
    {
        return _lessonsRepository.DeleteAsync(id, cancellationToken);
    }
}
