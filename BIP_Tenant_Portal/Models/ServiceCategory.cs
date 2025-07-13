namespace BIP_Tenant_Portal.Models
{
    public class ServiceCategory
    {
        public int CategoryID { get; set; }
        public string? CategoryType { get; set; }
        public string? CategoryDesc { get; set; } // Optional description of the category
        public int MainCategoryID { get; set; }
        public int SubCategoryID { get; set; }
    }
}
