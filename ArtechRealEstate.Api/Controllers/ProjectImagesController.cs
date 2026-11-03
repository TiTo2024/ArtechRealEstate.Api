using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtechRealEstate.Api.Data;
using ArtechRealEstate.Api.Models;

namespace ArtechRealEstate.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectImagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectImagesController(AppDbContext context)
        {
            _context = context;
        }

        // جلب صور معرض مشروع معين
        // GET: api/ProjectImages/project/{projectId}
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectImage>>> GetImagesForProject(int projectId)
        {
            return await _context.ProjectImages
                .Where(img => img.ProjectId == projectId)
                .ToListAsync();
        }

        // إضافة صورة جديدة لمعرض المشروع
        // POST: api/ProjectImages
        [HttpPost]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult<ProjectImage>> AddImageToProject([FromBody] ProjectImage imageDto)
        {
            var project = await _context.Projects.FindAsync(imageDto.ProjectId);
            if (project == null) return NotFound("المشروع غير موجود.");

            _context.ProjectImages.Add(imageDto);
            await _context.SaveChangesAsync();

            return Ok(imageDto);
        }

        // حذف صورة من المعرض
        // DELETE: api/ProjectImages/{id}
        [HttpDelete("{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> DeleteProjectImage(int id)
        {
            var image = await _context.ProjectImages.FindAsync(id);
            if (image == null) return NotFound("الصورة غير موجودة.");

            _context.ProjectImages.Remove(image);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}