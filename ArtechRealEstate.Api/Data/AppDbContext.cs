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
        public DbSet<ProjectImage> ProjectImages => Set<ProjectImage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // علاقة المشروع مع الوحدات (عند حذف المشروع تُحذف وحداته تلقائياً)
            modelBuilder.Entity<Unit>()
                .HasOne(u => u.Project)
                .WithMany(p => p.Units)
                .HasForeignKey(u => u.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // علاقة المشروع مع صور المعرض (عند حذف المشروع تُحذف صوره تلقائياً)
            modelBuilder.Entity<ProjectImage>()
                .HasOne(pi => pi.Project)
                .WithMany(p => p.GalleryImages)
                .HasForeignKey(pi => pi.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}