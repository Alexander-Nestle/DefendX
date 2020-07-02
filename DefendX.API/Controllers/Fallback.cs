using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace DefendX.API.Controllers
{
    public class Fallback : ControllerBase
    {
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), 
                "wwwroot", "index.html"), "text/HTML");
        }
    }
}