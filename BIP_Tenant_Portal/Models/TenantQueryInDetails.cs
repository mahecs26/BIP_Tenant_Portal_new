namespace BIP_Tenant_Portal.Models
{
    public class TenantQueryInDetails
    {
        public int QueryID { get; set; }
        public int TenantID { get; set; }
        public string? TenantName { get; set; }
        public int FlatID { get; set; }
        public string? FlatNumber { get; set; }
        public int PropertyID { get; set; }
        public string? PropertyName { get; set; }
        public int CategoryID { get; set; }
        public string? CategoryType { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public DateTime? PreferedVisitTime { get; set; }
        public DateTime? StatusChangedOn { get; set; }
        public DateTime? RaisedOn { get; set; }
        public string? RaisedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public int ResourceID { get; set; }
        public int DurationFromRaisedOn { get; set; }
        public string? ServiceRequestNumber { get; set; }
        public string? SubCategoryType { get; set; }

        public string? MainCategory { get; set; }
        public string? SubCategory { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public string? CommunicationMethod { get; set; }
        public string? FileName { get; set; }
        public int MainCategoryID { get; set; }
        public int SubCategoryID { get; set; }
    }
}
