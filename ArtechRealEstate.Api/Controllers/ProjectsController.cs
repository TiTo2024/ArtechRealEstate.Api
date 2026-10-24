using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtechRealEstate.Api.Data;
using ArtechRealEstate.Api.Models;
using ArtechRealEstate.Api.DTOs;

namespace ArtechRealEstate.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Projects (جلب جميع المشاريع مع الوحدات التابعة لها)
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.Units) // جلب الوحدات المرتبطة بكل مشروع
                .ToListAsync();

            return Ok(projects);
        }

        // GET: api/Projects/5 (جلب مشروع واحد بالـ ID)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Units)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound(new { message = "المشروع غير موجود" });
            }

            return Ok(project);
        }

        // POST: api/Projects (الإضافة الاحترافية باستخدام DTO)
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                Location = dto.Location,
                StartingPrice = dto.StartingPrice,
                Type = (ProjectType)dto.Type,       // التحويل الصريح للـ Enum
                Status = (ProjectStatus)dto.Status, // التحويل الصريح للـ Enum
                IsPublished = dto.IsPublished,
                CoverImageUrl = dto.CoverImageUrl,
                GalleryImages = dto.GalleryImages ?? new List<string>(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/Projects/5 (تعديل مشروع موجود)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] CreateProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound(new { message = "المشروع غير موجود" });
            }

            project.Name = dto.Name;
            project.Description = dto.Description;
            project.Location = dto.Location;
            project.StartingPrice = dto.StartingPrice;
            project.Type = (ProjectType)dto.Type;
            project.Status = (ProjectStatus)dto.Status;
            project.IsPublished = dto.IsPublished;
            project.CoverImageUrl = dto.CoverImageUrl;
            project.GalleryImages = dto.GalleryImages ?? new List<string>();

            await _context.SaveChangesAsync();

            return Ok(project);
        }

        // DELETE: api/Projects/5 (حذف مشروع)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound(new { message = "المشروع غير موجود" });
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم حذف المشروع بنجاح" });
        }
    }
}