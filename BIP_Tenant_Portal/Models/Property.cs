namespace BIP_Tenant_Portal.Models
{
    public class Property
    {
        public int PropertyID { get; set; }
        public string? PropertyName { get; set; }
        public string? PropertyType { get; set; }
        public string? BuildingCodes { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? Country { get; set; }
        public string? PropertyStatus { get; set; } // 'Active', 'Inactive', etc.
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow; // Default GETDATE()
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public string? ManagerInCharge { get; set; }  // NVARCHAR(255)
        public string? PhotoUploadLocation { get; set; }  // NVARCHAR(500)
        public string? BuildingOwner { get; set; }  // NVARCHAR(255)

        // Civil Defence Certificates (storing file paths)
        public string? CivilDefenceCertificate1_PDFPath { get; set; }  // Path for Certificate 1 (NVARCHAR(500))
        public DateTime? CivilDefenceCertificate1_StartDate { get; set; }  // DATE
        public DateTime? CivilDefenceCertificate1_EndDate { get; set; }  // DATE

        public string? CivilDefenceCertificate2_PDFPath { get; set; }  // Path for Certificate 2 (NVARCHAR(500))
        public DateTime? CivilDefenceCertificate2_StartDate { get; set; }  // DATE
        public DateTime? CivilDefenceCertificate2_EndDate { get; set; }  // DATE

        public string? CivilDefenceCertificate3_PDFPath { get; set; }  // Path for Certificate 3 (NVARCHAR(500))
        public DateTime? CivilDefenceCertificate3_StartDate { get; set; }  // DATE
        public DateTime? CivilDefenceCertificate3_EndDate { get; set; }  // DATE

        public string? CivilDefenceCertificate4_PDFPath { get; set; }  // Path for Certificate 4 (NVARCHAR(500))
        public DateTime? CivilDefenceCertificate4_StartDate { get; set; }  // DATE
        public DateTime? CivilDefenceCertificate4_EndDate { get; set; }  // DATE
    }
}
