using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace BIP_Tenant_Portal.Controllers
{
    [SessionTimeout]
    public class FlatManagementController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string apiURL;

        public FlatManagementController(IConfiguration configuration)
        {
            _configuration = configuration;
            apiURL = _configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;

        }

        public IActionResult Index()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
            return View();
        }

        public async Task<IActionResult> Edit(long id)
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync($"{apiURL}/api/Flats/{id}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var responseConetent = await response.Content.ReadAsStringAsync();
                        var flatDetails = JsonConvert.DeserializeObject<Flat>(responseConetent);

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

                        var propertyBuildingCodeResponse = await httpClient.GetAsync($"{apiURL}/api/PropertyBuildingCodes/GetBuildingCodesById/{flatDetails.BuildingCodeID}");
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

                        flatDetails.PropertyID = propertyBuildingCodeList.FirstOrDefault().PropertyID;

                        return View(flatDetails);
                    }
                    else
                    {
                        TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to retrive flat details");
                        return View("FlatList");
                    }
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(Flat flat)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        var jString = JsonConvert.SerializeObject(flat);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync($"{apiURL}/api/Flats", content))
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();
                            if (response.IsSuccessStatusCode)
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Flat added successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to save flat");
                                return View("Index", flat);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("Index", flat);
            }
            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Update(Flat flat)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        var jString = JsonConvert.SerializeObject(flat);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PutAsync($"{apiURL}/api/Flats/{flat.FlatID}", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Flat updated successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to update flat");
                                return View("Edit", flat);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("Edit", flat);
            }
            return RedirectToAction("FlatList");
        }

        [HttpPost]
        public async Task<IActionResult> Delete(long FlatID)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        using (var response = await httpClient.DeleteAsync($"{apiURL}/api/Flats/{FlatID}"))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Flat deleted successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to delete flat");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            return RedirectToAction("FlatList");
        }

        public IActionResult FlatList()
        {
            return View();
        }
    }
}
