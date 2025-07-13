using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;

namespace BIP_Tenant_Portal.ViewComponents
{
    public class MenuViewComponent(ApiService apiService) : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var userId = HttpContext.Session.GetString("UserID");
            var apiUrl = $"/api/UserPageAccesses/{userId}";
            var menuItems = await apiService.GetAsync<List<PagesModel>>(apiUrl);

            // Define icons dynamically based on PageName or ControllerName
            var iconMappings = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Dashboards", "fa-solid fa-chart-line" },
                { "Dashboard", "fa-solid fa-chart-line" },
                { "User Management", "fa-solid fa-users" },
                { "Building Management", "fa-solid fa-building" },
                { "Service Management", "fa-solid fa-cogs" },
                { "Reports", "fa-solid fa-file-alt" },
                { "Service Providers", "fa-solid fa-briefcase" },
                //{ "Holiday Master", "fa-solid fa-calendar" },
                //{ "Dashboard", "fa-solid fa-gauge" },
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
                //{ "Service Providers", "fa-solid fa-user-cog" },
                { "Service Provider List", "fa-solid fa-users-cog" },
                { "Create Service Provider", "fa-solid fa-user-plus" },
                { "Holiday Master", "fa-solid fa-calendar-days" },
                { "Holiday Calendar", "fa-solid fa-calendar" },
                { "Holiday Calendar View", "fa-solid fa-calendar-alt" },
                { "Create Tenant", "fa-solid fa-user-plus" },
                { "Tenant List", "fa-solid fa-users" },
                { "Tenant Bulk Upload", "fa-solid fa-file-upload" }
            };

            // Assign icons dynamically
            foreach (var menu in menuItems)
            {
                if (iconMappings.TryGetValue(menu.PageName, out var iconClass))
                {
                    menu.IconClass = iconClass;
                }
                else
                {
                    menu.IconClass = "fa-solid fa-circle"; // Default icon
                }
            }

            return View(menuItems);
        }
    }
}
