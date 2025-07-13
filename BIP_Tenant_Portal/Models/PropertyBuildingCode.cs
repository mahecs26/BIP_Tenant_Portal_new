
namespace BIP_Tenant_Portal.Models
{
    public class PropertyBuildingCode
    {
        public int BuildingCodeID { get; set; }

        public string BuildingCode { get; set; }

        public int PropertyID { get; set; }

        public string PropertyStatus { get; set; } 

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public string CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public string? ModifiedBy { get; set; }
    }
}
