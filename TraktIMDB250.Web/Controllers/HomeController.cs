using System.Web.Mvc;

namespace TraktIMDB250.Web.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			return View();
		}
	}
}
