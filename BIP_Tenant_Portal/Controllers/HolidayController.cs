using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace BIP_Tenant_Portal.Controllers
{
    [SessionTimeout]
    public class HolidayController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string apiURL;
        private readonly CommonSettings _commonSettings;

        public HolidayController(IConfiguration configuration, IOptions<CommonSettings> commonSettings)
        {
            _configuration = configuration;
            apiURL = _configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;
            _commonSettings = commonSettings.Value;
        }

        public async Task<IActionResult> Index()
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{apiURL}/api/Holidays"))
                {
                    var responseConetent = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        var userDetails = JsonConvert.DeserializeObject<List<Holiday>>(responseConetent);
                        return View(userDetails);
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrive holiday details");
                        return View();
                    }
                }
            }
        }

        public async Task<IActionResult> CalanderView()
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{apiURL}/api/Holidays/approved"))
                {
                    var responseConetent = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        var userDetails = JsonConvert.DeserializeObject<List<Holiday>>(responseConetent);
                        return View(userDetails);
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrive holiday details");
                        return View();
                    }
                }
            }
        }

        public async Task<IActionResult> CheckerIndex()
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{apiURL}/api/Holidays/pending"))
                {
                    var responseConetent = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        var userDetails = JsonConvert.DeserializeObject<List<Holiday>>(responseConetent);
                        return View(userDetails);
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrive holiday details");
                        return View();
                    }
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddHoliday(Holiday holiday)
        {
            using (var httpClient = new HttpClient())
            {
                var jString = JsonConvert.SerializeObject(holiday);
                StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                using (var response = await httpClient.PostAsync($"{apiURL}/api/Holidays", content))
                {
                    var responseConetent = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Holiday successfully");
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to add Holiday");
                    }
                }
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> ApproveHoliday(int id)
        {
            using (var httpClient = new HttpClient())
            {
                var holiday = new HolidayApproveRejectModel()
                {
                    Id = id,
                    ApprovedBy = "Approver Admin"
                };

                var jString = JsonConvert.SerializeObject(holiday);
                StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");

                using (var response = await httpClient.PostAsync($"{apiURL}/api/Holidays/approve", content))
                {
                    var responseConetent = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Holiday successfully");
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to add Holiday");
                    }
                }
            }

            return RedirectToAction("CheckerIndex");
        }

        [HttpPost]
        public async Task<IActionResult> RejectHoliday(int id)
        {
            using (var httpClient = new HttpClient())
            {
                var holiday = new HolidayApproveRejectModel()
                {
                    Id = id,
                    ApprovedBy = "Approver Admin"
                };

                var jString = JsonConvert.SerializeObject(holiday);
                StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");

                using (var response = await httpClient.PostAsync($"{apiURL}/api/Holidays/reject", content))
                {
                    var responseConetent = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Holiday successfully");
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to add Holiday");
                    }
                }
            }

            return RedirectToAction("CheckerIndex");
        }
    }
}
