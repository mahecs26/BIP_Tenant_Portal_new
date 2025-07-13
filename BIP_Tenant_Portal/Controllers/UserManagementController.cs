using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BIP_Tenant_Portal.Controllers
{
    [SessionTimeout]
    public class UserManagementController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string apiURL;
        private readonly CommonSettings _commonSettings;
        public UserManagementController(IConfiguration configuration, IOptions<CommonSettings> commonSettings)
        {
            _configuration = configuration;
            apiURL = _configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;
            _commonSettings = commonSettings.Value;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CreateUser()
        {
            return View();
        }

        public IActionResult CreateInternalUser()
        {
            return View();
        }

        public IActionResult CreateTechnician()
        {
            return View();
        }

        public IActionResult TenantBulkUpload()
        {
            return View();
        }

        public IActionResult ServiceProviderUpload()
        {
            return View();
        }

        public async Task<IActionResult> EditServiceProvider(long id)
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{apiURL}/api/Users/{id}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var responseConetent = await response.Content.ReadAsStringAsync();
                        var userDetails = JsonConvert.DeserializeObject<User>(responseConetent);

                        var flatResponse = await httpClient.GetAsync($"{apiURL}/api/Flats");
                        if (!flatResponse.IsSuccessStatusCode)
                        {
                            TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrieve flat list");
                            return View("UserList");
                        }

                        var flatResponseContent = await flatResponse.Content.ReadAsStringAsync();
                        var flatList = JsonConvert.DeserializeObject<List<Flat>>(flatResponseContent)!;

                        ViewBag.FlatList = flatList.Select(flat => new SelectListItem
                        {
                            Value = flat.FlatID.ToString(),
                            Text = flat.FlatNumber
                        }).ToList();

                        return View(userDetails);
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrive user details");
                        return View("UserList");
                    }
                }
            }
        }

        public async Task<IActionResult> Edit(long id)
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{apiURL}/api/Users/{id}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var responseConetent = await response.Content.ReadAsStringAsync();
                        var userDetails = JsonConvert.DeserializeObject<User>(responseConetent);

                        var propertyResponse = await httpClient.GetAsync($"{apiURL}/api/Properties");
                        if (!propertyResponse.IsSuccessStatusCode)
                        {
                            TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrieve property list");
                            return View("FlatList");
                        }

                        var propertyResponseContent = await propertyResponse.Content.ReadAsStringAsync();
                        var propertyList = JsonConvert.DeserializeObject<List<Property>>(propertyResponseContent)!;

                        ViewBag.PropertyList = propertyList.Select(flat => new SelectListItem
                        {
                            Value = flat.PropertyID.ToString(),
                            Text = flat.PropertyName
                        }).ToList();

                        var propertyBuildingCodeResponse = await httpClient.GetAsync($"{apiURL}/api/PropertyBuildingCodes/GetBuildingCodesByProperty/{userDetails.PropertyID}");
                        if (!propertyBuildingCodeResponse.IsSuccessStatusCode)
                        {
                            TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrieve property BuildingCode list");
                            return View("FlatList");
                        }

                        var propertyBuildingCodeResponseContent = await propertyBuildingCodeResponse.Content.ReadAsStringAsync();
                        var propertyBuildingCodeList = JsonConvert.DeserializeObject<List<PropertyBuildingCode>>(propertyBuildingCodeResponseContent)!;

                        ViewBag.PropertyBuildingCodeList = propertyBuildingCodeList.Select(flat => new SelectListItem
                        {
                            Value = flat.BuildingCodeID.ToString(),
                            Text = flat.BuildingCode
                        }).ToList();

                        var flatResponse = await httpClient.GetAsync($"{apiURL}/api/Flats/GetFlatsByBuildingCode/{userDetails.BuildingCodeID}");
                        if (!flatResponse.IsSuccessStatusCode)
                        {
                            TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrieve flat list");
                            return View("UserList");
                        }

                        var flatResponseContent = await flatResponse.Content.ReadAsStringAsync();
                        var flatList = JsonConvert.DeserializeObject<List<Flat>>(flatResponseContent)!;

                        ViewBag.FlatList = flatList.Select(flat => new SelectListItem
                        {
                            Value = flat.FlatID.ToString(),
                            Text = flat.FlatNumber
                        }).ToList();

                        return View(userDetails);
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrive user details");
                        return View("UserList");
                    }
                }
            }
        }

        public async Task<IActionResult> UserDetails(long id)
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{apiURL}/api/Users/{id}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var responseConetent = await response.Content.ReadAsStringAsync();
                        var userDetails = JsonConvert.DeserializeObject<User>(responseConetent);

                        return View("UserDetails", userDetails);
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrive user details");
                        return View("UserList");
                    }
                }
            }
        }

        public async Task<IActionResult> ServiceProviderDetails(long id)
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{apiURL}/api/Users/{id}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var responseConetent = await response.Content.ReadAsStringAsync();
                        var userDetails = JsonConvert.DeserializeObject<User>(responseConetent);

                        return View("ServiceProviderDetails", userDetails);
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrive user details");
                        return View("TechnicianList");
                    }
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(User user, IFormFile idCardfileAttached, IFormFile? CRfileAttached = null, IFormFile? AgreementCopy = null, IFormFile? VATfileAttached = null)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var fileExtension = Path.GetExtension(idCardfileAttached.FileName).ToLower();
                    if (!fileExtension.Contains(".pdf"))
                    {
                        return BadRequest("Only pdf files are allowed.");
                    }
                    var tempPath = $"\\tenant\\property_{user.BuildingCodeID}\\flat_{user.FlatID}\\";
                    var docUploadPath = $"{_commonSettings.DocumentUploadPath}{tempPath}";
                    if (!Directory.Exists(docUploadPath))
                    {
                        Directory.CreateDirectory(docUploadPath);
                    }

                    var fileName = $"{DateTime.Now.ToString("yyMMddHHmmssffffff")}{fileExtension}";
                    var filePath = Path.Combine(docUploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await idCardfileAttached.CopyToAsync(stream);
                    }

                    if (CRfileAttached != null)
                    {
                        var fileExtension1 = Path.GetExtension(CRfileAttached.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await UploadCR(CRfileAttached, user);
                    }

                    if (AgreementCopy != null)
                    {
                        var fileExtension1 = Path.GetExtension(AgreementCopy.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await UploadAgreementCopy(AgreementCopy, user);
                    }

                    if (VATfileAttached != null)
                    {
                        var fileExtension1 = Path.GetExtension(VATfileAttached.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await UploadVATCertificate(VATfileAttached, user);
                    }

                    using (var httpClient = new HttpClient())
                    {
                        user.IdCardPath = $"{tempPath}{fileName}";
                        user.UserType = "Tenant";
                        user.CreatedBy = HttpContext.Session.GetString("UserName");
                        user.ApprovedBy = HttpContext.Session.GetString("UserName");

                        user.CreatedOn = DateTime.Now;
                        user.UserStatus = "Active";
                        user.ApprovalStatus = "Approved";
                        user.ApprovalDate = DateTime.Now;
                        user.LoginId = user.Mobile;
                        user.FlatID = Convert.ToInt32(user.SelectedFlats.First());

                        var jString = JsonConvert.SerializeObject(user);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync($"{apiURL}/api/Users", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                var userDetails = JsonConvert.DeserializeObject<User>(responseConetent);
                                await UpdateFlats(userDetails.UserID, user.SelectedFlats);
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "User added successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to save User");
                                return View("CreateUser", user);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("CreateUser", user);
            }
            return RedirectToAction("CreateUser");
        }

        private async Task UpdateFlats(int userID, List<string> selectedFlats)
        {
            foreach (var item in selectedFlats)
            {
                var userProperties = new UserFlat()
                {
                    FlatID = Convert.ToInt32(item),
                    UserID = userID
                };

                using (var httpClient = new HttpClient())
                {
                    var jString = JsonConvert.SerializeObject(userProperties);
                    StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PostAsync($"{apiURL}/api/UserFlats", content))
                    {
                        var responseConetent = await response.Content.ReadAsStringAsync();
                        if (!response.IsSuccessStatusCode)
                        {
                            throw new Exception("Failed to update technician property details");
                        }
                    }
                }
            }
        }

        private async Task UploadCR(IFormFile idCardfileAttached, User user)
        {
            var fileExtension = Path.GetExtension(idCardfileAttached.FileName).ToLower();
            var tempPath = $"\\tenant\\property_{user.BuildingCodeID}\\flat_{user.FlatID}\\";
            var docUploadPath = $"{_commonSettings.DocumentUploadPath}{tempPath}";
            if (!Directory.Exists(docUploadPath))
            {
                Directory.CreateDirectory(docUploadPath);
            }

            var fileName = $"{DateTime.Now.ToString("yyMMddHHmmssffffff")}{fileExtension}";
            var filePath = Path.Combine(docUploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await idCardfileAttached.CopyToAsync(stream);
            }

            user.CRCardPath = $"{tempPath}{fileName}";
        }

        private async Task UploadVATCertificate(IFormFile idCardfileAttached, User user)
        {
            var fileExtension = Path.GetExtension(idCardfileAttached.FileName).ToLower();
            var tempPath = $"\\tenant\\property_{user.BuildingCodeID}\\flat_{user.FlatID}\\";
            var docUploadPath = $"{_commonSettings.DocumentUploadPath}{tempPath}";
            if (!Directory.Exists(docUploadPath))
            {
                Directory.CreateDirectory(docUploadPath);
            }

            var fileName = $"{DateTime.Now.ToString("yyMMddHHmmssffffff")}{fileExtension}";
            var filePath = Path.Combine(docUploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await idCardfileAttached.CopyToAsync(stream);
            }

            user.VATCertificatePath = $"{tempPath}{fileName}";
        }

        private async Task UploadAgreementCopy(IFormFile idCardfileAttached, User user)
        {
            var fileExtension = Path.GetExtension(idCardfileAttached.FileName).ToLower();
            var tempPath = $"\\tenant\\property_{user.BuildingCodeID}\\flat_{user.FlatID}\\";
            var docUploadPath = $"{_commonSettings.DocumentUploadPath}{tempPath}";
            if (!Directory.Exists(docUploadPath))
            {
                Directory.CreateDirectory(docUploadPath);
            }

            var fileName = $"{DateTime.Now.ToString("yyMMddHHmmssffffff")}{fileExtension}";
            var filePath = Path.Combine(docUploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await idCardfileAttached.CopyToAsync(stream);
            }

            user.AgreementCopyPath = $"{tempPath}{fileName}";
        }

        [HttpPost]
        public async Task<IActionResult> AddTechnician(User user, IFormFile CRfileAttached, IFormFile VATfileAttached)
        {
            try
            {
                if (ModelState.IsValid)
                {

                    if (CRfileAttached == null || VATfileAttached == null)
                    {
                        return BadRequest("Please upload CR copy and VAT certificate.");
                    }
                    else
                    {
                        var fileExtension1 = Path.GetExtension(CRfileAttached.FileName).ToLower();
                        var fileExtension2 = Path.GetExtension(VATfileAttached.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf") || !fileExtension2.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }
                        await UploadTechnicianCR(CRfileAttached, user);
                        await UploadTechnicianVAT(VATfileAttached, user);
                    }


                    using (var httpClient = new HttpClient())
                    {
                        user.UserType = "Technician";
                        user.CreatedBy = HttpContext.Session.GetString("UserName");
                        user.ApprovalStatus = "Pending";
                        user.PasswordHash = GenAutoPassword(user.FullName!, user.Mobile!);

                        user.CreatedOn = DateTime.Now;
                        user.UserStatus = "Active";
                        user.LoginId = user.Mobile;

                        var jString = JsonConvert.SerializeObject(user);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync($"{apiURL}/api/Users", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                var userDetails = JsonConvert.DeserializeObject<User>(responseConetent);
                                await UpdateCategories(userDetails.UserID, user.SelectedCategories);
                                await UpdateProperties(userDetails.UserID, user.PropertySelectedIds);
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "User added successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to save User");
                                return View("CreateTechnician", user);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("CreateTechnician", user);
            }
            return RedirectToAction("CreateTechnician");
        }
        private string GenAutoPassword(string usrName, string mblNumber)
        {
            return $"{usrName.Replace(" ", "").ToUpper().Substring(0, 4)}{mblNumber.ToString().Substring(Math.Max(0, mblNumber.ToString().Length - 4))}";
        }
        private async Task UploadTechnicianCR(IFormFile idCardfileAttached, User user)
        {
            var fileExtension = Path.GetExtension(idCardfileAttached.FileName).ToLower();
            var tempPath = $"\\ServiceProvider\\CR_{user.FullName}\\";
            var docUploadPath = $"{_commonSettings.DocumentUploadPath}{tempPath}";
            if (!Directory.Exists(docUploadPath))
            {
                Directory.CreateDirectory(docUploadPath);
            }

            var fileName = $"{DateTime.Now.ToString("yyMMddHHmmssffffff")}{fileExtension}";
            var filePath = Path.Combine(docUploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await idCardfileAttached.CopyToAsync(stream);
            }

            user.CRCardPath = $"{tempPath}{fileName}";
        }
        private async Task UploadTechnicianVAT(IFormFile idCardfileAttached, User user)
        {
            var fileExtension = Path.GetExtension(idCardfileAttached.FileName).ToLower();
            var tempPath = $"\\ServiceProvider\\VAT_{user.FullName}\\";
            var docUploadPath = $"{_commonSettings.DocumentUploadPath}{tempPath}";
            if (!Directory.Exists(docUploadPath))
            {
                Directory.CreateDirectory(docUploadPath);
            }

            var fileName = $"{DateTime.Now.ToString("yyMMddHHmmssffffff")}{fileExtension}";
            var filePath = Path.Combine(docUploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await idCardfileAttached.CopyToAsync(stream);
            }

            user.VATCertificatePath = $"{tempPath}{fileName}";
        }
        private async Task UpdateProperties(int userId, List<string> propertyIds)
        {
            foreach (var item in propertyIds)
            {
                var userProperties = new UserProperties()
                {
                    BuildingCodeID = Convert.ToInt32(item),
                    UserID = userId
                };

                using (var httpClient = new HttpClient())
                {
                    var jString = JsonConvert.SerializeObject(userProperties);
                    StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PostAsync($"{apiURL}/api/UserProperties", content))
                    {
                        var responseConetent = await response.Content.ReadAsStringAsync();
                        if (!response.IsSuccessStatusCode)
                        {
                            throw new Exception("Failed to update technician property details");
                        }
                    }
                }
            }
        }

        private async Task UpdateCategories(int userId, List<string> categoriesIds)
        {
            foreach (var item in categoriesIds)
            {
                var userServiceCategory = new UserServiceCategory()
                {
                    CategoryID = Convert.ToInt32(item),
                    UserID = userId
                };

                using (var httpClient = new HttpClient())
                {
                    var jString = JsonConvert.SerializeObject(userServiceCategory);
                    StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PostAsync($"{apiURL}/api/UserCategories", content))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();
                        }
                        else
                        {
                            throw new Exception("Failed to update technician category details");
                        }
                    }
                }
            }
        }

        private async Task UpdateCategories2(int userId, List<string> categoryIds)
        {
            var payload = new
            {
                UserId = userId,
                CategoryIds = categoryIds.Select(id => Convert.ToInt32(id)).ToList()
            };

            using (var httpClient = new HttpClient())
            {
                var json = JsonConvert.SerializeObject(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                using (var response = await httpClient.PostAsync($"{apiURL}/api/UserCategories/UpdateCategories", content))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception("Failed to update technician category details");
                    }
                }
            }
        }

        private async Task UpdateProperties2(int userId, List<string> propertyIds)
        {
            var payload = new
            {
                UserId = userId,
                PropertyIds = propertyIds.Select(id => Convert.ToInt32(id)).ToList()
            };

            using (var httpClient = new HttpClient())
            {
                var json = JsonConvert.SerializeObject(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                using (var response = await httpClient.PostAsync($"{apiURL}/api/UserProperties/UpdateProperties", content))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception("Failed to update technician property details");
                    }
                }
            }
        }


        [HttpPost]
        public async Task<IActionResult> Update(User user, IFormFile? idCardfileAttached = null, IFormFile? CRfileAttached = null, IFormFile? AgreementCopy = null, IFormFile? VATfileAttached = null)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (idCardfileAttached != null)
                    {
                        var fileExtension = Path.GetExtension(idCardfileAttached.FileName).ToLower();
                        if (!fileExtension.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }
                        var tempPath = $"\\tenant\\property_{user.BuildingCodeID}\\flat_{user.FlatID}\\";
                        var docUploadPath = $"{_commonSettings.DocumentUploadPath}{tempPath}";
                        if (!Directory.Exists(docUploadPath))
                        {
                            Directory.CreateDirectory(docUploadPath);
                        }

                        var fileName = $"{DateTime.Now.ToString("yyMMddHHmmssffffff")}{fileExtension}";
                        var filePath = Path.Combine(docUploadPath, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await idCardfileAttached.CopyToAsync(stream);
                        }

                        user.IdCardPath = $"{tempPath}{fileName}";
                    }

                    if (CRfileAttached != null)
                    {
                        var fileExtension1 = Path.GetExtension(CRfileAttached.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await UploadCR(CRfileAttached, user);
                    }

                    if (AgreementCopy != null)
                    {
                        var fileExtension1 = Path.GetExtension(AgreementCopy.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await UploadAgreementCopy(AgreementCopy, user);
                    }

                    if (VATfileAttached != null)
                    {
                        var fileExtension1 = Path.GetExtension(VATfileAttached.FileName).ToLower();
                        if (!fileExtension1.Contains(".pdf"))
                        {
                            return BadRequest("Only pdf files are allowed.");
                        }

                        await UploadVATCertificate(VATfileAttached, user);
                    }

                    using (var httpClient = new HttpClient())
                    {
                        user.CreatedBy = HttpContext.Session.GetString("UserName");

                        var jString = JsonConvert.SerializeObject(user);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PutAsync($"{apiURL}/api/Users/UpdateServiceProvider/{user.UserID}", content))
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();

                            if (response.IsSuccessStatusCode)
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "User updated successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to update User");
                                return View("Edit", user);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("Edit", user);
            }
            return RedirectToAction("UserList");
        }

        [HttpPost]
        public async Task<IActionResult> UpdateServiceProvider(User user, IFormFile? CRfileAttached = null, IFormFile? VATfileAttached = null)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (CRfileAttached != null || VATfileAttached != null)
                    {

                        if (CRfileAttached != null)
                        {
                            var fileExtension1 = Path.GetExtension(CRfileAttached.FileName).ToLower();
                            if (!fileExtension1.Contains(".pdf"))
                            {
                                return BadRequest("Only pdf files are allowed.");
                            }
                            await UploadTechnicianCR(CRfileAttached, user);
                        }
                        if (VATfileAttached != null)
                        {
                            var fileExtension2 = Path.GetExtension(VATfileAttached.FileName).ToLower();
                            if (!fileExtension2.Contains(".pdf"))
                            {
                                return BadRequest("Only pdf files are allowed.");
                            }
                            await UploadTechnicianVAT(VATfileAttached, user);
                        }
                    }
                    using (var httpClient = new HttpClient())
                    {
                        user.ModifiedBy = HttpContext.Session.GetString("UserName");
                        user.UserStatus = "Active";

                        var jString = JsonConvert.SerializeObject(user);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PutAsync($"{apiURL}/api/Users/UpdateServiceProvider/{user.UserID}", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                
                                await UpdateCategories2(user.UserID, user.SelectedCategories);
                                await UpdateProperties2(user.UserID, user.PropertySelectedIds);

                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "User updated successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, response.ReasonPhrase ?? "Failed to update User");
                                return View("EditServiceProvider", user);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("EditServiceProvider", user);
            }
            return RedirectToAction("TechnicianList");
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int UserID, string Operation, string Source)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        var user = new User()
                        {
                            CreatedBy = HttpContext.Session.GetString("UserName"),
                            UserID = UserID,
                            UserStatus = Operation == "Activate" ? "Active" : "InActive",
                        };

                        var jString = JsonConvert.SerializeObject(user);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PutAsync($"{apiURL}/api/Users/UpdateServiceProvider/{UserID}", content))
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();

                            if (response.IsSuccessStatusCode)
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "User updated successfully");
                            }
                            else if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, responseConetent ?? "Failed to update User");
                                //return View("EditServiceProvider", user);
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, response.ReasonPhrase ?? "Failed to update User");
                                //return View("EditServiceProvider", user);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            //return RedirectToAction("UserList");
            return RedirectToAction(Source);
        }

        public IActionResult UserList()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
            return View();
        }

        public IActionResult InternalUserList()
        {
            return View();
        }

        public async Task<IActionResult> EditInternalUser(long id)
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{apiURL}/api/Users/{id}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var responseConetent = await response.Content.ReadAsStringAsync();
                        var userDetails = JsonConvert.DeserializeObject<User>(responseConetent);

                        return View(userDetails);
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrive user details");
                        return View("UserList");
                    }
                }
            }
        }

        public IActionResult TechnicianList()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
            return View();
        }

        public IActionResult TechnicianApproverList()
        {
            return View();
        }

        public IActionResult TenantApproverList()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ApproveReject(int UserID, string Operation, string Source)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        var user = new User()
                        {
                            ApprovalStatus = Operation == "Approve" ? "Approved" : "Rejected",
                            //UserStatus = Operation == "Approve" ? "Active" : "InActive",
                            ApprovalDate = DateTime.Now,
                            ApprovedBy = HttpContext.Session.GetString("UserName"),
                            UserID = UserID
                        };

                        var url = $"{apiURL}/api/Users/ApproveReject";

                        var jString = JsonConvert.SerializeObject(user);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync(url, content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, $"User {Operation} successfully");
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
