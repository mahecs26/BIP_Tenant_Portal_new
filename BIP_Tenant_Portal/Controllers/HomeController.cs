using System.Diagnostics;
using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace BIP_Tenant_Portal.Controllers
{

    public class HomeController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<HomeController> _logger;
        private readonly string apiURL;
        private readonly ApiService _apiService;

        public HomeController(ApiService apiService, IConfiguration configuration, ILogger<HomeController> logger)
        {
            _configuration = configuration;
            _logger = logger;
            apiURL = _configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;
            _apiService = apiService;
        }

        [SessionTimeout]
        public async Task<IActionResult> Index()
        {
            using (var httpClient = new HttpClient())
            {
                await httpClient.GetAsync($"{apiURL}/api/Users/update-expired");
            }
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
            return View();
        }

        [SessionTimeout]
        public IActionResult UserDashboard()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
            return View();
        }

        [SessionTimeout]
        [HttpGet]
        public IActionResult ChooseUserFlat(string flatId)
        {
            HttpContext.Session.SetString("FlatID", flatId);
            return RedirectToAction("Landing");
        }

        [SessionTimeout]
        public async Task<IActionResult> Landing()
        {
            var UserID = HttpContext.Session.GetString("UserID");

            var FlatID = HttpContext.Session.GetString("FlatID");

            if (string.IsNullOrEmpty(FlatID))
            {
                if (await IsUserHavingMoreFlats(UserID))
                {
                    return RedirectToAction("ChooseFlat");
                }
            }

            var apiUrl = $"/api/UserPageAccesses/{UserID}";
            var response = await _apiService.GetAsync<List<PagesModel>>(apiUrl);

            ViewBag.PageIcons = GetPageIcons();

            ViewBag.UserID = UserID;
            return View(response);
        }

        private async Task<bool> IsUserHavingMoreFlats(string userId)
        {
            var apiUrl = $"/api/UserFlats/GetUserFlats/{userId}";
            var response = await _apiService.GetAsync<List<UserFlatDto>>(apiUrl);

            if (response != null)
            {
                if (response.Count == 1)
                {
                    var flatId = response[0].FlatID.ToString();

                    // Set in session properly
                    HttpContext.Session.SetString("FlatID", flatId);

                    return false; // Only one flat
                }

                return response.Count > 1;
            }

            return false;
        }


        private Dictionary<string, string> GetPageIcons()
        {
            return new Dictionary<string, string>
            {
                { "Dashboard", "fa-solid fa-gauge" },
                { "Service Dashboard", "fa-solid fa-chart-pie" },
                { "Create Building", "fa-solid fa-city" },
                { "Building List", "fa-solid fa-building" },
                { "Create Service Category", "fa-solid fa-plus-square" },
                { "Service Category List", "fa-solid fa-list" },
                { "Create Property", "fa-solid fa-house-user" },
                { "Property List", "fa-solid fa-home" },
                { "Common Area Service Request", "fa-solid fa-tools" },
                { "Service Request List", "fa-solid fa-clipboard-list" },
                { "Assign Request", "fa-solid fa-tasks" },
                { "Query Assignment List", "fa-solid fa-question-circle" },
                { "Service Request Report", "fa-solid fa-chart-line" },
                { "Property Report", "fa-solid fa-file-alt" },
                { "Create Service Request", "fa-solid fa-plus-circle" },
                { "Service Providers", "fa-solid fa-user-cog" },
                { "Service Provider List", "fa-solid fa-users-cog" },
                { "Create Service Provider", "fa-solid fa-user-plus" },
                { "Holiday Master", "fa-solid fa-calendar-days" },
                { "Holiday Calendar", "fa-solid fa-calendar" },
                { "Holiday Calendar View", "fa-solid fa-calendar-alt" },
                { "Create Tenant", "fa-solid fa-user-plus" },
                { "Tenant List", "fa-solid fa-users" },
                { "Tenant Bulk Upload", "fa-solid fa-file-upload" }
            };
        }

        [SessionTimeout]
        public IActionResult TechnicianDashboard()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        public IActionResult UpdateInfo()
        {
            return View();
        }

        public IActionResult ChooseFlat()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;

            return View();
        }

        [SessionTimeout]
        public async Task<IActionResult> SaveInfo(string Email, string Mobile)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    var saveInfoModel = new SaveInfoModel()
                    {
                        Email = Email,
                        UserID = Convert.ToInt32(HttpContext.Session.GetString("UserID")),
                        Mobile = Mobile,
                    };

                    var jString = JsonConvert.SerializeObject(saveInfoModel);
                    StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PostAsync($"{apiURL}/api/Users/SaveInfo", content))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();

                            TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Information Updated");

                            //return RedirectToAction("UserDashboard");
                            //return RedirectToAction("Index", "UserServiceRequest");
                            return RedirectToAction("Landing");
                        }
                        else
                        {
                            TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to update information");
                            return View("UpdateInfo");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, "Failed to update information");
                return View("UpdateInfo");
            }
        }

        public async Task<IActionResult> UserLogin(string username, string userpassword)
        {
            try
            {
                // Inject ILogger into the controller
                _logger.LogInformation("UserLogin method started");

                using (var httpClient = new HttpClient())
                {
                    var user = new User()
                    {
                        Email = username,
                        PasswordHash = userpassword,
                        Mobile = username,
                        EmployeeId = username,
                        LoginId = username
                    };

                    _logger.LogDebug("User object created with email: {Username}", username);
                    var jString = JsonConvert.SerializeObject(user);
                    StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");

                    _logger.LogInformation("Sending POST request to {ApiUrl}", $"{apiURL}/api/Users/GetUserByPassword");

                    using (var response = await httpClient.PostAsync($"{apiURL}/api/Users/GetUserByPassword", content))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            _logger.LogInformation("Login request successful. Processing response.");

                            var responseContent = await response.Content.ReadAsStringAsync();
                            var userDetails = JsonConvert.DeserializeObject<User>(responseContent)!;

                            TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Login success");
                            HttpContext.Session.SetString("UserID", userDetails.UserID.ToString());
                            HttpContext.Session.SetString("UserName", userDetails.FullName ?? "Admin");

                            _logger.LogInformation("User {Username} logged in successfully", username);

                            if (userDetails.UserType.ToLower() == "admin")
                            {
                                HttpContext.Session.SetString("UserRole", "admin");
                                _logger.LogInformation("User is an Admin. Redirecting to Admin Dashboard.");

                                return RedirectToAction("Landing");
                                //return RedirectToAction("Index");
                            }
                            else if (userDetails.UserType.ToLower() == "tenant")
                            {
                                HttpContext.Session.SetString("UserRole", "tenant");
                                //HttpContext.Session.SetString("FlatID", userDetails.FlatID.ToString());
                                _logger.LogInformation("User is a Tenant. Redirecting to Tenant Dashboard.");

                                if (string.IsNullOrEmpty(userDetails.Email) || string.IsNullOrEmpty(userDetails.Mobile))
                                {
                                    _logger.LogInformation("User has missing email or mobile. Redirecting to UpdateInfo.");
                                    return RedirectToAction("UpdateInfo");
                                }
                                else
                                {
                                    //return RedirectToAction("Index", "UserServiceRequest");
                                    return RedirectToAction("Landing");
                                }
                            }
                            else if (userDetails.UserType == "Approver")
                            {
                                HttpContext.Session.SetString("UserRole", "Approver");
                                _logger.LogInformation("User is a Technician Approver. Redirecting to Technician Approver List.");
                                //return RedirectToAction("TechnicianApproverList", "UserManagement");
                                return RedirectToAction("Landing");
                            }
                            else
                            {
                                HttpContext.Session.SetString("UserRole", "technician");
                                HttpContext.Session.SetString("PropertyID", userDetails.PropertyID.ToString());
                                _logger.LogInformation("User is a Technician. Redirecting to Technician Dashboard.");
                                //return RedirectToAction("TechnicianDashboard");
                                return RedirectToAction("Landing");
                            }
                        }
                        else
                        {
                            _logger.LogWarning("Invalid login credentials for {Username}. Response: {StatusCode}", username, response.StatusCode);
                            TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Invalid login credentials");
                            return View("Login");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for user {Username}", username);
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, "Login failed");
                return View("Login");
            }
        }


        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "Home");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
