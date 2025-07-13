namespace BIP_Tenant_Portal.Models
{
    public class TenantQuery
    {
        public int QueryID { get; set; }
        public int TenantID { get; set; }
        public int FlatID { get; set; }
        public int CategoryID { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; } // 'Open', 'Scheduled', 'OnHold', 'Closed'
        public DateTime? PreferedVisitTime { get; set; }
        public string PreferedVisitDate { get; set; }
        public string PreferedVisitTimeValue { get; set; }
        public string? CommunicationMethod { get; set; } // E.g., 'Phone', 'Email'
        public DateTime RaisedOn { get; set; } = DateTime.UtcNow; // Default GETDATE()
        public string? RaisedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }

        public int MainCategoryID { get; set; }
        public int SubCategoryID { get; set; }

    }
    public class Tenant
    {
        public string? ServiceCategory { get; set; }
        public string? VisitTime { get; set; } // This might be a DateTime, so adjust accordingly
        public string? CommunicationMethod { get; set; }
        public string? Description { get; set; }
        public IFormFile? Upload { get; set; } // If you're uploading files
    }
}
