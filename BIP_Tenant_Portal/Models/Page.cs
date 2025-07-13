namespace BIP_Tenant_Portal.Models
{
    public class PagesModel
    {
        public int Id { get; set; }
        public required string PageName { get; set; }
        public required string ControllerName { get; set; }
        public required string ActionName { get; set; }
        public bool IsActive { get; set; } = true;
        public int? ParentMenuId { get; set; }
        public int MenuOrder { get; set; }
        public string? IconClass { get; set; }
    }
}
