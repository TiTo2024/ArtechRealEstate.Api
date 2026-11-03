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

        // GET: api/Projects (جلب جميع المشاريع مع الوحدات ومعرض الصور)
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.Units)
                .Include(p => p.GalleryImages)
                .ToListAsync();

            return Ok(projects);
        }

        // GET: api/Projects/5 (جلب مشروع واحد بالـ ID)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Units)
                .Include(p => p.GalleryImages)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound(new { message = "المشروع غير موجود" });
            }

            return Ok(project);
        }

        // POST: api/Projects (إنشاء مشروع جديد)
        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
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
                Type = (ProjectType)dto.Type,
                Status = (ProjectStatus)dto.Status,
                IsPublished = dto.IsPublished,
                CoverImageUrl = dto.CoverImageUrl,
                CreatedAt = DateTime.UtcNow,
                Units = dto.Units.Select(unit => new Unit
                {
                    UnitNumber = unit.UnitNumber,
                    AreaM2 = unit.AreaM2,
                    Floor = unit.Floor,
                    Bedrooms = unit.Bedrooms,
                    Bathrooms = unit.Bathrooms,
                    Price = unit.Price,
                    Availability = (UnitAvailability)unit.Availability
                }).ToList(),
                GalleryImages = dto.GalleryImages.Select(image => new ProjectImage
                {
                    ImageUrl = image.ImageUrl
                }).ToList()
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/Projects/5 (تعديل بيانات المشروع الأساسية)
        [HttpPut("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] CreateProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var project = await _context.Projects
                .Include(p => p.Units)
                .Include(p => p.GalleryImages)
                .FirstOrDefaultAsync(p => p.Id == id);

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

            _context.Units.RemoveRange(project.Units);
            project.Units = dto.Units.Select(unit => new Unit
            {
                UnitNumber = unit.UnitNumber,
                AreaM2 = unit.AreaM2,
                Floor = unit.Floor,
                Bedrooms = unit.Bedrooms,
                Bathrooms = unit.Bathrooms,
                Price = unit.Price,
                Availability = (UnitAvailability)unit.Availability
            }).ToList();

            _context.ProjectImages.RemoveRange(project.GalleryImages);
            project.GalleryImages = dto.GalleryImages.Select(image => new ProjectImage
            {
                ImageUrl = image.ImageUrl
            }).ToList();

            await _context.SaveChangesAsync();

            return Ok(project);
        }

        // DELETE: api/Projects/5 (حذف مشروع)
        [HttpDelete("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
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