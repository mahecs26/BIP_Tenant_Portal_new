namespace BIP_Tenant_Portal.Models
{
    public class Feature
    {
        public int FeatureID { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; } // Feature type: 'Property' or 'Flat'
        public string? Description { get; set; } // Optional description of the feature
    }
}
