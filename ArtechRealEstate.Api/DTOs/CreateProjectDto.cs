using System.ComponentModel.DataAnnotations;

namespace ArtechRealEstate.Api.DTOs
{
    public class CreateProjectDto
    {
        [Required(ErrorMessage = "اسم المشروع مطلوب")]
        [StringLength(100, ErrorMessage = "اسم المشروع لا يمكن أن يتجاوز 100 حرف")]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "موقع المشروع مطلوب")]
        public string Location { get; set; } = string.Empty;

        [Range(0, double.MaxValue, ErrorMessage = "يجب أن يكون السعر رقماً موجباً")]
        public decimal StartingPrice { get; set; }

        public int Type { get; set; }

        public int Status { get; set; }

        public bool IsPublished { get; set; } = true;

        public string? CoverImageUrl { get; set; }

        public List<string>? GalleryImages { get; set; } = new();
    }
}