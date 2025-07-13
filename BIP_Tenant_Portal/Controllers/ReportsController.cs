using BIP_Tenant_Portal.Models;
using Microsoft.AspNetCore.Mvc;

namespace BIP_Tenant_Portal.Controllers
{
    [SessionTimeout]
    public class ReportsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ServiceRequestReport()
        {
            return View();
        }

        public IActionResult PropertyReport()
        {
            return View();
        }

        public IActionResult StaffReport()
        {
            return View();
        }

        public IActionResult ComplaintSummaryReport()
        {
            // Set up initial model
            var model = new ReportDateRangeViewModel
            {
                DateRangeType = "Daily",
                StartDate = DateTime.Today,
                EndDate = DateTime.Today
            };
            return View(model);
        }

        public IActionResult BuildingPerformanceReport()
        {
            // Set up initial model
            var model = new ReportDateRangeViewModel
            {
                DateRangeType = "Daily",
                StartDate = DateTime.Today,
                EndDate = DateTime.Today
            };
            return View(model);
        }

        public IActionResult ResponseResolutionTimeReport()
        {
            // Set up initial model
            var model = new ReportDateRangeViewModel
            {
                DateRangeType = "Daily",
                StartDate = DateTime.Today,
                EndDate = DateTime.Today
            };
            return View(model);
        }
        public IActionResult RecurringIssueAnalysisReport()
        {
            // Set up initial model
            var model = new ReportDateRangeViewModel
            {
                DateRangeType = "Daily",
                StartDate = DateTime.Today,
                EndDate = DateTime.Today
            };
            return View(model);
        }
        public IActionResult CustomerFeedbackSatisfactionReport()
        {
            // Set up initial model
            var model = new ReportDateRangeViewModel
            {
                DateRangeType = "Daily",
                StartDate = DateTime.Today,
                EndDate = DateTime.Today
            };
            return View(model);
        }
    }
}

