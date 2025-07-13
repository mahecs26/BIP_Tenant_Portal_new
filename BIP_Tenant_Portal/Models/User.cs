namespace BIP_Tenant_Portal.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string? UserType { get; set; } // 'Admin', 'Tenant', or 'Technician'
        public string? FullName { get; set; }
        public string? Occupants { get; set; }
        public string? EmployeeId { get; set; }
        public string? LoginId { get; set; }
        public string? IdCardNumber { get; set; }
        public DateTime? IdExpiryDate { get; set; }
        public string? IdCardPath { get; set; }
        public string? CRNumber { get; set; }
        public DateTime? CRExpiryDate { get; set; }
        public string? CRCardPath { get; set; }
        public string? VATCertificatePath { get; set; }
        public DateTime? ConStartDate { get; set; }
        public DateTime? ConEndDate { get; set; }
        public string? Email { get; set; } // Nullable Email
        public string? Mobile { get; set; } // Mandatory Mobile
        public string? PasswordHash { get; set; }
        public string? UserStatus { get; set; } // 'Active', 'Inactive', etc.
        public string? UserDescription { get; set; } // Optional Description
        public int? FlatID { get; set; } // Can be NULL if not assigned
        public int? BuildingCodeID { get; set; }
        public int? PropertyID { get; set; }
        public int? CategoryID { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow; // Default GETDATE()
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? LastLogin { get; set; }
        public string? ApprovalStatus { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public DateTime? ValidityDate { get; set; }

        public List<string>? PropertySelectedIds { get; set; }
        public List<string>? SelectedCategories { get; set; }
        public List<string>? SelectedFlats { get; set; }

        public DateTime? TenancyStartDate { get; set; }  // Nullable DateTime
        public DateTime? TenancyEndDate { get; set; }    // Nullable DateTime
        public string? MunicipalityAgreementNumber { get; set; }  // Nullable string
        public string? AgreementCopyPath { get; set; }   // Nullable string
    }
}
