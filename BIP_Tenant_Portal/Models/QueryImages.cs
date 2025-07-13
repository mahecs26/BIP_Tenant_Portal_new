namespace BIP_Tenant_Portal.Models
{
    public class QueryImages
    {
        public int ImageID { get; set; }
        public int QueryID { get; set; }
        public string? FileName { get; set; }
        public DateTime? UploadedDate { get; set; }
    }
}
