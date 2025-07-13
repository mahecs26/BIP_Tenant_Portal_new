namespace BIP_Tenant_Portal.Models
{
    public class TenantSubQuery
    {
        public int SubQueryID { get; set; }
        public int ServiceRequestID { get; set; }
        public int CategoryID { get; set; }
        public string? SubRequestNumber { get; set; }
        public string? Status { get; set; } // 'Assigned', 'In Progress', 'Closed'
        public int AssignedTechnicianID { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? PreferredVisitTime { get; set; }
        public string? Notes { get; set; }
    }
}
