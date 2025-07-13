using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace BIP_Tenant_Portal.Controllers
{
    [SessionTimeout]
    public class PropertiesController(ApiService apiService, IConfiguration configuration, IOptions<CommonSettings> commonSettings) : Controller
    {
        private readonly string apiURL = configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;
        private readonly ApiService _apiService = apiService;
        private readonly CommonSettings _commonSettings = commonSettings.Value;

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult BuildingManagement()
        {
            return View();
        }

        public async Task<IActionResult> ViewBuilding(long id)
        {
            try
            {
                var propertyDetails = await _apiService.GetAsync<Property>($"/api/Properties/{id}");
                return View(propertyDetails);
            }
            catch (Exception)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrieve property details");
                return View();
            }
        }

        public async Task<IActionResult> Edit(long id)
        {
            try
            {
                var propertyDetails = await _apiService.GetAsync<Property>($"/api/Properties/{id}");
                return View(propertyDetails);
            }
            catch (Exception)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrieve property details");
                return View("PropertiesList");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(Property property, IFormFile? BuildingPhoto = null, IFormFile? certificate1Pdf = null, IFormFile? certificate2Pdf = null, IFormFile? certificate3Pdf = null, IFormFile? certificate4Pdf = null)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (BuildingPhoto != null)
                    {
                        var allowedExtensions = new HashSet<string> { ".jpg", ".jpeg", ".png", ".gif" };
                        var fileExtension1 = Path.GetExtension(BuildingPhoto.FileName).ToLower();

                        if (!allowedExtensions.Contains(fileExtension1))
                        {
                            return BadRequest("Only image files (JPG, JPEG, PNG, GIF) are allowed.");
                        }

                        await UploadBuildingPhoto(BuildingPhoto, property);
                    }


                    if (certificate1Pdf != null)
                    {
                        var fileExtension1 = Path.GetExtension(certificate1Pdf.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await Uploadcertificate1Pdf(certificate1Pdf, property);
                    }

                    if (certificate2Pdf != null)
                    {
                        var fileExtension1 = Path.GetExtension(certificate2Pdf.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await Uploadcertificate2Pdf(certificate2Pdf, property);
                    }

                    if (certificate3Pdf != null)
                    {
                        var fileExtension1 = Path.GetExtension(certificate3Pdf.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await Uploadcertificate3Pdf(certificate3Pdf, property);
                    }

                    if (certificate4Pdf != null)
                    {
                        var fileExtension1 = Path.GetExtension(certificate4Pdf.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await Uploadcertificate4Pdf(certificate4Pdf, property);
                    }

                    using (var httpClient = new HttpClient())
                    {
                        property.CreatedBy = HttpContext.Session.GetString("UserID");

                        var jString = JsonConvert.SerializeObject(property);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync($"{apiURL}/api/Properties", content))
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();
                            if (response.IsSuccessStatusCode)
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Property added successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to save property");
                                return View("Index", property);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("Index", property);
            }
            return RedirectToAction("PropertiesList");
        }

        private async Task UploadBuildingPhoto(IFormFile idCardfileAttached, Property property)
        {
            var tempPath = $"buildings\\property_{property.PropertyName}\\";
            property.PhotoUploadLocation = await UploadFileAsync(idCardfileAttached, tempPath);
        }

        private async Task Uploadcertificate4Pdf(IFormFile idCardfileAttached, Property property)
        {
            var tempPath = $"buildings\\property_{property.PropertyName}\\";
            property.CivilDefenceCertificate4_PDFPath = await UploadFileAsync(idCardfileAttached, tempPath);
        }

        private async Task Uploadcertificate3Pdf(IFormFile idCardfileAttached, Property property)
        {
            var tempPath = $"buildings\\property_{property.PropertyName}\\";
            property.CivilDefenceCertificate3_PDFPath = await UploadFileAsync(idCardfileAttached, tempPath);
        }

        private async Task Uploadcertificate2Pdf(IFormFile idCardfileAttached, Property property)
        {
            var tempPath = $"buildings\\property_{property.PropertyName}\\";
            property.CivilDefenceCertificate2_PDFPath = await UploadFileAsync(idCardfileAttached, tempPath);
        }

        private async Task Uploadcertificate1Pdf(IFormFile idCardfileAttached, Property property)
        {
            var tempPath = $"buildings\\property_{property.PropertyName}\\";
            property.CivilDefenceCertificate1_PDFPath = await UploadFileAsync(idCardfileAttached, tempPath);
        }

        private async Task<string> UploadFileAsync(IFormFile file, string basePath)
        {
            var fileExtension = Path.GetExtension(file.FileName).ToLower();
            var fileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{DateTime.Now:yyMMddHHmmssffffff}{fileExtension}";
            var filePath = Path.Combine(_commonSettings.DocumentUploadPath, basePath, fileName);

            if (!Directory.Exists(basePath))
            {
                Directory.CreateDirectory(basePath);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Path.Combine(basePath, fileName);
        }

        [HttpPost]
        public async Task<IActionResult> Update(Property property, IFormFile? BuildingPhoto = null, IFormFile? certificate1Pdf = null, IFormFile? certificate2Pdf = null, IFormFile? certificate3Pdf = null, IFormFile? certificate4Pdf = null)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (BuildingPhoto != null)
                    {
                        var allowedExtensions = new HashSet<string> { ".jpg", ".jpeg", ".png", ".gif" };
                        var fileExtension1 = Path.GetExtension(BuildingPhoto.FileName).ToLower();

                        if (!allowedExtensions.Contains(fileExtension1))
                        {
                            return BadRequest("Only image files (JPG, JPEG, PNG, GIF) are allowed.");
                        }

                        await UploadBuildingPhoto(BuildingPhoto, property);
                    }


                    if (certificate1Pdf != null)
                    {
                        var fileExtension1 = Path.GetExtension(certificate1Pdf.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await Uploadcertificate1Pdf(certificate1Pdf, property);
                    }

                    if (certificate2Pdf != null)
                    {
                        var fileExtension1 = Path.GetExtension(certificate2Pdf.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await Uploadcertificate2Pdf(certificate2Pdf, property);
                    }

                    if (certificate3Pdf != null)
                    {
                        var fileExtension1 = Path.GetExtension(certificate3Pdf.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await Uploadcertificate3Pdf(certificate3Pdf, property);
                    }

                    if (certificate4Pdf != null)
                    {
                        var fileExtension1 = Path.GetExtension(certificate4Pdf.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await Uploadcertificate4Pdf(certificate4Pdf, property);
                    }

                    using (var httpClient = new HttpClient())
                    {
                        property.ModifiedBy = HttpContext.Session.GetString("UserID");

                        var jString = JsonConvert.SerializeObject(property);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PutAsync($"{apiURL}/api/Properties/{property.PropertyID}", content))
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();
                            if (response.IsSuccessStatusCode)
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Property updated successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to update property");
                                return View("Edit", property);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("Edit", property);
            }
            return RedirectToAction("PropertiesList");
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int PropertyID)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        using (var response = await httpClient.DeleteAsync($"{apiURL}/api/Properties/{PropertyID}"))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Property deleted successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to delete property");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            return RedirectToAction("PropertiesList");
        }

        public IActionResult PropertiesList()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
            return View();
        }

        [HttpPost("ApproveReject")]
        public async Task<IActionResult> ApproveReject(int PropertyID, string Operation, string Source)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        var user = new Property_Check()
                        {
                            ApprovalStatus = Operation == "Approve" ? "Approved" : "Rejected",
                            ApprovalDate = DateTime.Now,
                            ApprovedBy = HttpContext.Session.GetString("UserName"),
                            PropertyID = PropertyID
                        };

                        var url = $"{apiURL}/api/Properties/ApproveReject";

                        var jString = JsonConvert.SerializeObject(user);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync(url, content))
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();
                            if (response.IsSuccessStatusCode)
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, $"Property {Operation} successfully");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            return RedirectToAction(Source);
        }
    }
}
