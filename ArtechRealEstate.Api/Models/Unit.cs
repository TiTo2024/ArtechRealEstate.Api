namespace ArtechRealEstate.Api.Models
{
    public enum UnitAvailability
    {
        Available,
        Sold,
        Reserved
    }

    public class Unit
    {
        public int Id { get; set; }
        public string UnitNumber { get; set; } = string.Empty;
        public double AreaM2 { get; set; }
        public int Floor { get; set; }
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public decimal Price { get; set; }
        public UnitAvailability Availability { get; set; } = UnitAvailability.Available;

        // Foreign Key
        public int ProjectId { get; set; }
        public Project? Project { get; set; }
    }
}