using Microsoft.EntityFrameworkCore;
using TutoringCRM.Domain.Entities;

namespace TutoringCRM.Infrastructure.Data;

public class TutoringDbContext : DbContext
{
    public TutoringDbContext(DbContextOptions<TutoringDbContext> options) : base(options)
    {
    }

    public DbSet<Student> Students { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
}
