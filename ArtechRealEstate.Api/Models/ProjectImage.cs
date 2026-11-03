using System.Text.Json.Serialization;

namespace ArtechRealEstate.Api.Models
{
    public class ProjectImage
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        // العلاقة مع المشروع
        public int ProjectId { get; set; }
        [JsonIgnore]
        public Project? Project { get; set; }
    }
}