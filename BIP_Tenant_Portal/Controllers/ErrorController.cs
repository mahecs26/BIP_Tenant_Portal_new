using Microsoft.AspNetCore.Mvc;

namespace BIP_Tenant_Portal.Controllers
{
    public class ErrorController : Controller
    {
        [Route("Error/{statusCode}")]
        public IActionResult HttpStatusCodeHandler(int statusCode)
        {
            ViewBag.StatusCode = statusCode;

            string message = statusCode switch
            {
                404 => "Oops! The page you are looking for does not exist.",
                405 => "Oops! Method Not Allowed.",
                500 => "Oops! Something went wrong on the server.",
                _ => "An unexpected error occurred."
            };

            ViewBag.ErrorMessage = message;
            return View("ErrorPage");
        }
    }
}
