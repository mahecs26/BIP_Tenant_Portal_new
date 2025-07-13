namespace BIP_Tenant_Portal.Models
{
    public class PropertyContactDetail
    {
        public int ContactID { get; set; }
        public int PropertyID { get; set; }
        public string? ContactName { get; set; }
        public string? ContactType { get; set; } // Type of contact (e.g., 'Manager', 'Maintenance', 'Emergency')
        public string? Role { get; set; } // Role of the contact (e.g., 'Manager', 'Plumber', 'Electrician')
        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; } = true; // Default 1 for active
        public bool Emergency { get; set; } = false; // Default 0 for non-emergency
        public string? Notes { get; set; } // Additional notes (e.g., contractor specifics)
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow; // Default GETDATE()
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
    }
}
