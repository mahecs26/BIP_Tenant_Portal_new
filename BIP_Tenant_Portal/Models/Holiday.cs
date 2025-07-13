namespace BIP_Tenant_Portal.Models
{
    public class Holiday
    {
        public int Id { get; set; }

        public string? HolidayName { get; set; }

        public DateTime HolidayDate { get; set; }

        public bool IsRecurring { get; set; }
        public string? HolidayType { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string Status { get; set; } = "Pending"; // New field
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
    }
    public class HolidayApproveRejectModel
    {
        public int Id { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
    }
}
