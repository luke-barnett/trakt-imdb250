using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;

namespace TraktIMDB250.Web.API
{
	public class TraktController : ApiController
	{
		[Route("api/trakt/{username}")]
		[HttpGet]
		public async Task<HttpResponseMessage> TraktMovies(string username)
		{
			using (var client = new HttpClient())
			{
				client.BaseAddress = new Uri("https://api-v2launch.trakt.tv");

				client.DefaultRequestHeaders.Add("trakt-api-version", "2");
				client.DefaultRequestHeaders.Add("trakt-api-key", TraktIMDB250.Web.Infrastructure.Configuration.TraktClientId);

				var memoryStream = new MemoryStream();

				await (await client.GetStreamAsync(string.Format("users/{0}/watched/movies", username))).CopyToAsync(memoryStream);

				memoryStream.Position = 0;

				var result = new HttpResponseMessage(HttpStatusCode.OK)
				{
					Content = new ByteArrayContent(memoryStream.ToArray())
				};

				result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

				return result;
			}
		}
	}
}
