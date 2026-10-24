using Microsoft.EntityFrameworkCore;
using ArtechRealEstate.Api.Models;

namespace ArtechRealEstate.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Project> Projects => Set<Project>();
        public DbSet<Unit> Units => Set<Unit>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Unit>()
                .HasOne(u => u.Project)
                .WithMany(p => p.Units)
                .HasForeignKey(u => u.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}