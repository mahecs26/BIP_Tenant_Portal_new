namespace BIP_Tenant_Portal.Models
{
    public class ReportDateRangeViewModel
    {
        public string DateRangeType { get; set; } // Daily, Weekly, Monthly, Yearly, Custom
        public DateTime? StartDate { get; set; } // Used for Custom Range
        public DateTime? EndDate { get; set; }   // Used for Custom Range
    }
}
