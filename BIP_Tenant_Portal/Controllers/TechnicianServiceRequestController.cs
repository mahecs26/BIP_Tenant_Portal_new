using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace BIP_Tenant_Portal.Controllers
{
    [SessionTimeout]
    public class TechnicianServiceRequestController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string apiURL;
        public TechnicianServiceRequestController(IConfiguration configuration)
        {
            _configuration = configuration;
            apiURL = _configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;

        }

        public IActionResult ServiceRequestList()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
            return View();
        }

        public IActionResult DetailedView()
        {
            var UserID = HttpContext.Session.GetString("UserID");
            ViewBag.UserID = UserID;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> UpdateSave(QueryAssignmentModel assignment)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        QueryAssignment queryAssignment = new QueryAssignment()
                        {
                            QueryID = assignment.QueryAssignmentDetails.QueryID,
                            AssignmentID = assignment.QueryAssignmentDetails.AssignmentID,
                            ResourceID = assignment.QueryAssignmentDetails.ResourceID,
                            Description = assignment.QueryAssignmentDetails.Description,
                            Status = assignment.QueryAssignmentDetails.Status,
                            ModifiedOn = DateTime.Now,
                            ModifiedBy = HttpContext.Session.GetString("UserID"),
                            Comments = assignment.Comments
                        };
                        var jString = JsonConvert.SerializeObject(queryAssignment);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PutAsync($"{apiURL}/api/QueryAssignments/{assignment.QueryAssignmentDetails.AssignmentID}", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Query assigned successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to assign the query");
                                return View("Update", assignment);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("Update", assignment);
            }
            return RedirectToAction("ServiceRequestList");
        }

        public async Task<IActionResult> Update(int id)
        {
            try
            {
                var UserID = HttpContext.Session.GetString("UserID");
                ViewBag.UserID = UserID;

                var list = await GetAssignments(id);
                if (list != null && list.Count > 0)
                {
                    var obj = list.FirstOrDefault();
                    return View(obj);
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            return RedirectToAction("ServiceRequestList");
        }

        private async Task<List<QueryAssignmentModel>> GetAssignments(int id)
        {
            try
            {
                var endpoint = id > 0 ? $"{apiURL}/api/QueryAssignments/Technician/{id}" : $"{apiURL}/api/QueryAssignments";

                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(endpoint))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();
                            if (!string.IsNullOrEmpty(responseConetent))
                            {
                                var list = new List<QueryAssignmentModel>();
                                if (id > 0)
                                {
                                    list.Add(JsonConvert.DeserializeObject<QueryAssignmentModel>(responseConetent)!);
                                }
                                else
                                {
                                    list = JsonConvert.DeserializeObject<List<QueryAssignmentModel>>(responseConetent);
                                }
                                if (list != null && list.Count > 0)
                                {
                                    return list;
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return [];
        }
        public async Task<IActionResult> ShowImage(int id)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync(apiURL + $"/api/QueryImages/ShowImage/{id}"))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();
                            if (!string.IsNullOrEmpty(responseConetent))
                            {
                                var list = JsonConvert.DeserializeObject<List<string>>(responseConetent) ?? [];
                                if (list.Count > 0)
                                {
                                    for (int i = 0; i < list.Count; i++)
                                    {
                                        list[i] = $"/uploads/{list[i]}";
                                    }
                                    return View("ShowImage", list);
                                }

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
    }
}
