namespace ArtechRealEstate.Api.Models
{
    public enum ProjectType
    {
        Residential,
        Commercial
    }

    public enum ProjectStatus
    {
        UnderConstruction,
        Completed
    }

    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal StartingPrice { get; set; }
        public ProjectType Type { get; set; } = ProjectType.Residential;
        public ProjectStatus Status { get; set; } = ProjectStatus.UnderConstruction;
        public bool IsPublished { get; set; } = false;
        public string? CoverImageUrl { get; set; }
        public List<string> GalleryImages { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // العلاقة: المشروع الواحد محتوي على عدة وحدات
        public ICollection<Unit> Units { get; set; } = new List<Unit>();
    }
}