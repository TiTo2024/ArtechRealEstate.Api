using Microsoft.AspNetCore.Mvc;
using ArtechRealEstate.Api.Data;

namespace ArtechRealEstate.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HealthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetHealth()
        {
            bool isDbConnected = _context.Database.CanConnect();
            return Ok(new
            {
                Company = "ARTECH - Live The Experience",
                Status = "Online",
                DatabaseConnected = isDbConnected,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}