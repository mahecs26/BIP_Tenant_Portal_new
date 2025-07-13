using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace BIP_Tenant_Portal.Controllers
{
    [SessionTimeout]
    public class QueryAssignmentController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string apiURL;
        public QueryAssignmentController(IConfiguration configuration)
        {
            _configuration = configuration;
            apiURL = _configuration.GetValue<string>("BaseURL:WebApiURL") ?? string.Empty;
        }
        public async Task<IActionResult> Index()
        {
            try
            {
                var UserID = HttpContext.Session.GetString("UserID");
                ViewBag.UserID = UserID;

                var list = await GetQueries();
                if (list != null && list.Count > 0)
                {
                    return View(list);
                }

            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            return View();
        }
        public async Task<IActionResult> Edit(int id)
        {
            try
            {
                var list = await GetQueries();
                if (list != null && list.Count > 0)
                {
                    var obj = list.Where(r => r.QueryID == id).FirstOrDefault();
                    if (obj != null && obj.QueryID > 0)
                        return View("Edit", obj);
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            return RedirectToAction("Index");
        }
        [HttpPost]
        public async Task<IActionResult> Submit(TenantQueryInDetails tenantQuery)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var httpClient = new HttpClient())
                    {
                        QueryAssignment queryAssignment = new QueryAssignment()
                        {
                            QueryID = tenantQuery.QueryID,
                            ResourceID = tenantQuery.ResourceID,
                            Description = tenantQuery.Description,
                            Status = "Scheduled",
                            AssignedOn = DateTime.Now,
                            AssignedBy = HttpContext.Session.GetString("UserID")
                        };
                        var jString = JsonConvert.SerializeObject(queryAssignment);
                        StringContent content = new StringContent(jString, System.Text.Encoding.UTF8, "application/json");
                        using (var response = await httpClient.PostAsync($"{apiURL}/api/QueryAssignments", content))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                var responseConetent = await response.Content.ReadAsStringAsync();
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Success, "Query assigned successfully");
                            }
                            else
                            {
                                TempData["Message"] = CommonServices.ShowAlert(Alert.Warning, "Failed to assign the query");
                                return View("Edit", tenantQuery);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
                return View("Edit", tenantQuery);
            }
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> AssignmentList()
        {

            try
            {
                var UserID = HttpContext.Session.GetString("UserID");
                ViewBag.UserID = UserID;

                var list = await GetAssignments(0);
                if (list != null && list.Count > 0)
                {
                    return View("AssignmentList", list);
                }

            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            return View("AssignmentList");
        }
        public async Task<IActionResult> Update(int id)
        {
            try
            {
                var list = await GetAssignments(id);
                if (list != null && list.Count > 0)
                {
                    var obj = list.Where(r => r.QueryAssignmentDetails.AssignmentID == id).FirstOrDefault();
                    if (obj != null && obj.QueryAssignmentDetails.QueryID > 0)
                    {
                        using (var httpClient = new HttpClient())
                        {
                            using (var response = await httpClient.GetAsync($"{apiURL}/api/Users/Technician"))
                            {
                                if (response.IsSuccessStatusCode)
                                {
                                    var content = await response.Content.ReadAsStringAsync();
                                    if (!string.IsNullOrEmpty(content))
                                    {
                                        var userList = JsonConvert.DeserializeObject<List<dynamic>>(content);
                                        ViewBag.ResourseList = userList?.Select(flat => new SelectListItem
                                        {
                                            Value = flat.userID.ToString(),
                                            Text = flat.fullName
                                        }).ToList();
                                    }
                                }
                            }
                        }

                        return View(obj);
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Message"] = CommonServices.ShowAlert(Alert.Danger, ex.Message);
            }
            return RedirectToAction("AssignmentList");
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
            return RedirectToAction("AssignmentList");
        }
        private async Task<List<TenantQueryInDetails>> GetQueries()
        {
            try
            {
                var UserID = HttpContext.Session.GetString("UserID");

                using (var httpClient = new HttpClient())
                {
                    using (var response = await httpClient.GetAsync($"{apiURL}/api/TenantQueries/GetTenantQueryInDetailsByUserProperties/" + UserID))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            var responseConetent = await response.Content.ReadAsStringAsync();
                            if (!string.IsNullOrEmpty(responseConetent))
                            {
                                var list = JsonConvert.DeserializeObject<List<TenantQueryInDetails>>(responseConetent);
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
        private async Task<List<QueryAssignmentModel>> GetAssignments(int id)
        {
            try
            {
                var UserID = HttpContext.Session.GetString("UserID");

                var endpoint = id > 0 ? $"{apiURL}/api/QueryAssignments/{id}" : $"{apiURL}/api/QueryAssignments/GetQueryAssignmentByUser/{UserID}";

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
    }
}
