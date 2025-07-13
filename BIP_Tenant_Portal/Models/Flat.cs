using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BIP_Tenant_Portal.Models
{
    public class Flat
    {
        public int FlatID { get; set; }
        public int BuildingCodeID { get; set; }

        public int PropertyID { get; set; }
        public string? FlatNumber { get; set; }
        public string? Floor { get; set; }
        public string? Area { get; set; }
        public string? NoOfRooms { get; set; }
        [ValidateNever]
        public string? Size { get; set; }// in square feet
        public string? FlatType { get; set; } // Residential or Commercial
        [ValidateNever]
        public decimal? RentAmount { get; set; }
        public bool IsOccupied { get; set; } = false; // Default 0 for not occupied
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow; // Default GETDATE()
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
    }
}
