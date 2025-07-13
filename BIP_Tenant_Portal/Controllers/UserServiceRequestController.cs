using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Web;

namespace BIP_Tenant_Portal.Controllers
{
    [SessionTimeout]
    public class UserServiceRequestController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string apiURL;
        private readonly CommonSettings _commonSettings;

        public UserServiceRequestController(IConfiguration configuration, IOptions<CommonSettings> commonSettings)
        {
            _configuration = configuration;
            apiURL = _configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;
            _commonSettings = commonSettings.Value;
        }

        public IActionResult Index()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;

            var FlatID = HttpContext.Session.GetString("FlatID");
            ViewBag.FlatID = FlatID;

            return View();
        }
        public IActionResult ServiceRequestList()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
            return View();
        }

        public async Task<IActionResult> DetailedView(int id)
        {
            try
            {
                var UserID = HttpContext.Session.GetString("UserID");
                ViewBag.UserID = UserID;

                ViewBag.QueryId = id;
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(TenantQuery tenantQuery)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        tenantQuery.FlatID = Convert.ToInt32(HttpContext.Session.GetString("FlatID"));
                        tenantQuery.TenantID = Convert.ToInt32(HttpContext.Session.GetString("UserID"));

                        var jString = JsonConvert.SerializeObject(tenantQuery);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync($"{apiURL}/api/TenantQueries", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                var TenantQuery2 = JsonConvert.DeserializeObject<TenantQuery>(responseConetent);
                                string queryString = response.Headers.Location!.Query;
                                if (!string.IsNullOrEmpty(queryString))
                                {
                                    var queryParameters = HttpUtility.ParseQueryString(queryString);
                                    string ServiceRequestNumber = queryParameters["ServiceRequestNumber"] ?? "Empty";
                                    //HttpContext.Session.SetString("ServiceRequestNumber", ServiceRequestNumber);
                                    TempData["ServiceRequestNumber"] = ServiceRequestNumber;

                                }

                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Query requested successfully");

                                var queryAssignment = new QueryAssignment()
                                {
                                    QueryID = TenantQuery2.QueryID,
                                    //ResourceID = tenantQuery.FlatID,
                                    Description = TenantQuery2.Description,
                                    Status = "Scheduled",
                                    AssignedOn = DateTime.Now,
                                    AssignedBy = HttpContext.Session.GetString("UserID")
                                };
                                await Submit(queryAssignment);
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to send the query");
                                return View("Index", tenantQuery);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("Index", tenantQuery);
            }
            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> ChangeStatus(int QueryID, string Operation)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        var queryAssignment = new QueryAssignment()
                        {
                            QueryID = QueryID,
                            ModifiedBy = HttpContext.Session.GetString("UserID")
                        };

                        var url = $"{apiURL}/api/QueryAssignments/Accept";
                        if (Operation == "Reopen")
                        {
                            url = $"{apiURL}/api/QueryAssignments/Reopen";
                        }

                        var jString = JsonConvert.SerializeObject(queryAssignment);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync(url, content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, $"Query {Operation} successfully");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            return RedirectToAction("ServiceRequestList");
        }

        private async Task Submit(QueryAssignment queryAssignment)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        var jString = JsonConvert.SerializeObject(queryAssignment);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync($"{apiURL}/api/QueryAssignments/FromUser", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Query assigned successfully");

                                string? queryString = response.Headers.Location?.Query;
                                if (!string.IsNullOrEmpty(queryString))
                                {
                                    var queryParameters = HttpUtility.ParseQueryString(queryString);

                                    TempData["ServiceProviderName"] = queryParameters["ServiceProviderName"] ?? "";
                                }
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to assign the query");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOK(List<Tenant> tenantQuery)
        {
            string ServiceRequestNumberOveralll = string.Empty;
            try
            {
                if (ModelState.IsValid)
                {
                    foreach (var item in tenantQuery)
                    {
                        string fileName = string.Empty;
                        if (item.Upload != null)
                        {
                            var allowedExtensions = new[] { ".jpg", ".png", ".jpeg" };
                            var fileExtension = Path.GetExtension(item.Upload.FileName).ToLower();
                            if (!allowedExtensions.Contains(fileExtension))
                            {
                                return BadRequest("Only image files are allowed.");
                            }

                            if (!Directory.Exists(_commonSettings.DocumentUploadPath))
                            {
                                Directory.CreateDirectory(_commonSettings.DocumentUploadPath);
                            }

                            fileName = $"{Path.GetFileNameWithoutExtension(item.Upload.FileName)}_{Guid.NewGuid()}{fileExtension}";
                            var filePath = Path.Combine(_commonSettings.DocumentUploadPath, fileName);

                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await item.Upload.CopyToAsync(stream);
                            }
                        }
                        using (var httpClient = new HttpClient())
                        {
                            var tenantQueries = new TenantQuery()
                            {
                                FlatID = Convert.ToInt32(HttpContext.Session.GetString("FlatID")),
                                TenantID = Convert.ToInt32(HttpContext.Session.GetString("UserID")),
                                RaisedBy = HttpContext.Session.GetString("UserID"),
                                CategoryID = Convert.ToInt32(item.ServiceCategory),
                                CommunicationMethod = item.CommunicationMethod,
                                Description = item.Description,
                                PreferedVisitTime = item.VisitTime == null ? null : Convert.ToDateTime(item.VisitTime)
                            };
                            tenantQueries.FlatID = Convert.ToInt32(HttpContext.Session.GetString("FlatID"));
                            tenantQueries.TenantID = Convert.ToInt32(HttpContext.Session.GetString("UserID"));

                            var jString = JsonConvert.SerializeObject(tenantQueries);
                            StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                            using (var response = await httpClient.PostAsync($"{apiURL}/api/TenantQueries/PostTenantQueryUser", content))
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                if (response.IsSuccessStatusCode)
                                {
                                    var TenantQuery2 = JsonConvert.DeserializeObject<TenantQuery>(responseConetent);
                                    TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Query requested successfully");

                                    string queryString = response.Headers.Location!.Query;
                                    if (!string.IsNullOrEmpty(queryString))
                                    {
                                        var queryParameters = HttpUtility.ParseQueryString(queryString);
                                        string ServiceRequestNumber = queryParameters["ServiceRequestNumber"] ?? "Empty";
                                        if (ServiceRequestNumber != "Empty")
                                        {
                                            ServiceRequestNumberOveralll = ServiceRequestNumberOveralll == null ? ServiceRequestNumber : $"{ServiceRequestNumberOveralll}&nbsp;&nbsp;&nbsp;{ServiceRequestNumber}";
                                        }

                                    }


                                    var queryAssignment = new QueryAssignment()
                                    {
                                        QueryID = TenantQuery2.QueryID,
                                        //ResourceID = tenantQuery.FlatID,
                                        Description = TenantQuery2.Description,
                                        Status = "Scheduled",
                                        AssignedOn = DateTime.Now,
                                        AssignedBy = HttpContext.Session.GetString("UserID"),
                                        CategoryID = Convert.ToInt32(item.ServiceCategory)
                                    };
                                    await Submit(queryAssignment);

                                    if (!string.IsNullOrEmpty(fileName))
                                    {
                                        var queryImages = new QueryImages()
                                        {
                                            FileName = fileName,
                                            QueryID = queryAssignment.QueryID,
                                            UploadedDate = DateTime.Now
                                        };
                                        await SaveImageDetails(queryImages);
                                    }
                                }
                                else
                                {
                                    TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to send the query");
                                    return BadRequest(responseConetent);
                                }
                            }
                        }
                    }
                    TempData["ServiceRequestNumber"] = ServiceRequestNumberOveralll;
                    return Ok("All services create successfully");
                }
                else
                {
                    return BadRequest("Model not valid");
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return BadRequest(ex.Message);
            }
        }

        private async Task SaveImageDetails(QueryImages queryImages)
        {
            if (ModelState.IsValid)
            {
                using (var httpClient = new HttpClient())
                {
                    var jString = JsonConvert.SerializeObject(queryImages);
                    StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PostAsync($"{apiURL}/api/QueryImages", content))
                    {
                        var responseConetent = await response.Content.ReadAsStringAsync();
                        if (!response.IsSuccessStatusCode)
                        {
                            throw new Exception(responseConetent);
                        }
                    }
                }
            }
        }
    }
}
