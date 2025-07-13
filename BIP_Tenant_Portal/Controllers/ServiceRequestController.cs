using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Reflection;
using System.Web;

namespace BIP_Tenant_Portal.Controllers
{
    [SessionTimeout]
    public class ServiceRequestController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string apiURL;
        public ServiceRequestController(IConfiguration configuration)
        {
            _configuration = configuration;
            apiURL = _configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;

        }
        public async Task<IActionResult> Index()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;

            await GetMainServiceCategories();

            return View();
        }

        private async Task GetMainServiceCategories()
        {
            using (var client = new HttpClient())
            {
                try
                {
                    var response = await client.GetAsync($"{apiURL}/api/ServiceMainCategory");

                    if (response.IsSuccessStatusCode)
                    {
                        var json = await response.Content.ReadAsStringAsync();

                        var categories = JsonConvert.DeserializeObject<List<ServiceMainCategory>>(json);

                        ViewBag.MainCategories = categories.Select(m => new SelectListItem
                        {
                            Value = m.MainCategoryID.ToString(),
                            Text = m.MainCategoryName
                        }).ToList();
                    }
                    else
                    {
                        ViewBag.MainCategories = new List<SelectListItem>();
                    }
                }
                catch (Exception ex)
                {
                    // Log error here
                    ViewBag.MainCategories = new List<SelectListItem>();
                }
            }
        }

        public IActionResult ServiceRequestList()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
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
                        var combinedDateTime = $"{tenantQuery.PreferedVisitDate} {tenantQuery.PreferedVisitTimeValue}";

                        if (DateTime.TryParse(combinedDateTime, out DateTime parsedDateTime))
                        {
                            tenantQuery.PreferedVisitTime = parsedDateTime;
                        }
                        else
                        {
                            TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, "Invalid date and time format.");
                            return View("Index", tenantQuery);
                            //Console.WriteLine("Invalid date and time format.");
                        }

                        tenantQuery.RaisedBy = HttpContext.Session.GetString("UserID");
                        tenantQuery.CategoryID = tenantQuery.SubCategoryID;

                        var jString = JsonConvert.SerializeObject(tenantQuery);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync($"{apiURL}/api/TenantQueries", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                string queryString = response.Headers.Location!.Query;
                                if (!string.IsNullOrEmpty(queryString))
                                {
                                    var queryParameters = HttpUtility.ParseQueryString(queryString);
                                    string ServiceRequestNumber = queryParameters["ServiceRequestNumber"] ?? "Empty";
                                    //HttpContext.Session.SetString("ServiceRequestNumber", ServiceRequestNumber);
                                    TempData["ServiceRequestNumber"] = ServiceRequestNumber;

                                }
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Query requested successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to send the query");

                                await GetMainServiceCategories();

                                return View("Index", tenantQuery);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);

                await GetMainServiceCategories();

                return View("Index", tenantQuery);
            }
            return RedirectToAction("Index");
        }
    }
}
