using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtechRealEstate.Api.Data;
using ArtechRealEstate.Api.Models;
using ArtechRealEstate.Api.DTOs;

namespace ArtechRealEstate.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnitsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UnitsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Units/project/1 (عرض وحدات مشروع معين)
        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetUnitsByProject(int projectId)
        {
            var units = await _context.Units
                .Where(u => u.ProjectId == projectId)
                .ToListAsync();

            return Ok(units);
        }

        // GET: api/Units/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUnit(int id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null)
            {
                return NotFound(new { message = "الوحدة غير موجودة" });
            }

            return Ok(unit);
        }

        // POST: api/Units (إضافة وحدة مع ربطها بمشروع)
        [HttpPost]
        public async Task<IActionResult> CreateUnit([FromBody] CreateUnitDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // التأكد من وجود المشروع أولاً
            var projectExists = await _context.Projects.AnyAsync(p => p.Id == dto.ProjectId);
            if (!projectExists)
            {
                return BadRequest(new { message = "المشروع المحدد غير موجود في النظام" });
            }

            var unit = new Unit
            {
                UnitNumber = dto.UnitNumber,
                AreaM2 = dto.AreaM2,
                Floor = dto.Floor,
                Bedrooms = dto.Bedrooms,
                Bathrooms = dto.Bathrooms,
                Price = dto.Price,
                Availability = dto.Availability,
                ProjectId = dto.ProjectId
            };

            _context.Units.Add(unit);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUnit), new { id = unit.Id }, unit);
        }

        // PUT: api/Units/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUnit(int id, [FromBody] CreateUnitDto dto)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null)
            {
                return NotFound(new { message = "الوحدة غير موجودة" });
            }

            unit.UnitNumber = dto.UnitNumber;
            unit.AreaM2 = dto.AreaM2;
            unit.Floor = dto.Floor;
            unit.Bedrooms = dto.Bedrooms;
            unit.Bathrooms = dto.Bathrooms;
            unit.Price = dto.Price;
            unit.Availability = dto.Availability;
            unit.ProjectId = dto.ProjectId;

            await _context.SaveChangesAsync();

            return Ok(unit);
        }

        // DELETE: api/Units/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnit(int id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null)
            {
                return NotFound(new { message = "الوحدة غير موجودة" });
            }

            _context.Units.Remove(unit);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم حذف الوحدة بنجاح" });
        }
    }
}