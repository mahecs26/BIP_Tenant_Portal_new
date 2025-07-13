using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace BIP_Tenant_Portal.Controllers
{
    [SessionTimeout]
    public class ServiceCategoryController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string apiURL;
        public ServiceCategoryController(IConfiguration configuration)
        {
            _configuration = configuration;
            apiURL = _configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;

        }
        public async Task<IActionResult> Index()
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

            return View();
        }

        public IActionResult ServiceCategoryList()
        {
            return View("ServiceCategoryList");
        }

        [HttpPost]
        public async Task<IActionResult> Create(ServiceCategory category)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        var jString = JsonConvert.SerializeObject(category);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync($"{apiURL}/api/ServiceCategories", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Service category added successfully.");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to save service category.");
                                return View("Index", category);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("Index", category);
            }
            return RedirectToAction("Index");
        }
        public async Task<IActionResult> Edit(long id)
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


            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{apiURL}/api/ServiceCategories/{id}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var responseConetent = await response.Content.ReadAsStringAsync();
                        var propertyDetails = JsonConvert.DeserializeObject<ServiceCategory>(responseConetent);
                        return View(propertyDetails);
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrive service category details");
                        return View("ServiceCategoryList");
                    }
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> Update(ServiceCategory serviceCategory)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        var jString = JsonConvert.SerializeObject(serviceCategory);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PutAsync($"{apiURL}/api/ServiceCategories/{serviceCategory.CategoryID}", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Service category updated successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to update service category");
                                return View("Edit", serviceCategory);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("Edit", serviceCategory);
            }
            return RedirectToAction("ServiceCategoryList");
        }
    }
}
