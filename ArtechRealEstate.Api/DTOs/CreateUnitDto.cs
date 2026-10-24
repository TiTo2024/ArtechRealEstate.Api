using System.ComponentModel.DataAnnotations;
using ArtechRealEstate.Api.Models;

namespace ArtechRealEstate.Api.DTOs
{
    public class CreateUnitDto
    {
        [Required(ErrorMessage = "رقم الوحدة مطلوب")]
        public string UnitNumber { get; set; } = string.Empty;

        [Range(1, double.MaxValue, ErrorMessage = "المساحة يجب أن تكون أكبر من 0")]
        public double AreaM2 { get; set; }

        public int Floor { get; set; }

        [Range(0, 50)]
        public int Bedrooms { get; set; }

        [Range(0, 50)]
        public int Bathrooms { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "السعر يجب أن يكون رقماً موجباً")]
        public decimal Price { get; set; }

        public UnitAvailability Availability { get; set; } = UnitAvailability.Available;

        [Required(ErrorMessage = "يجب تحديد المشروع التابعة له الوحدة")]
        public int ProjectId { get; set; }
    }
}