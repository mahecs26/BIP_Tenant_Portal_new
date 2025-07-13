namespace BIP_Tenant_Portal.Models
{
    public class QueryAssignment
    {
        public int AssignmentID { get; set; }
        public int QueryID { get; set; }
        public int ResourceID { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; } // 'Open', 'Scheduled', 'OnHold', 'Closed'
        public DateTime AssignedOn { get; set; } = DateTime.UtcNow; // Default GETDATE()
        public string? AssignedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? Comments { get; set; }
        public int CategoryID { get; set; }
    }
    public class QueryAssignmentModel
    {
        public string? BuildingCode { get; set; }
        public string? FlatNumber { get; set; }
        public string? FlatType { get; set; }
        public string? PropertyName { get; set; }
        public string? TechnicianName { get; set; }
        public string? TenantName { get; set; }
        public string? Comments { get; set; }
        public string? ServiceRequestNumber { get; set; }
        public string? MainCategory { get; set; }
        public string? SubCategory { get; set; }
        public QueryAssignmentDetails? QueryAssignmentDetails { get; set; }
    }

    public class QueryAssignmentDetails
    {
        public int AssignmentID { get; set; }
        public int QueryID { get; set; }
        public int ResourceID { get; set; }
        public int DurationFromRaisedOn { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public DateTime? AssignedOn { get; set; }
        public string? AssignedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? StatusChangedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? ServiceRequestNumber { get; set; }
    }

}
