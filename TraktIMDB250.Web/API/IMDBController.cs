using Microsoft.WindowsAzure.Storage;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;

namespace TraktIMDB250.Web.API
{
	public class IMDBController : ApiController
	{
		[Route("api/imdb/top250")]
		[HttpGet]
		public async Task<HttpResponseMessage> Top250()
		{
			var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["Storage"].ConnectionString);

			var blobClient = storageAccount.CreateCloudBlobClient();

			var container = blobClient.GetContainerReference("imdb-top250");

			if (!(await container.ExistsAsync()))
			{
				return Request.CreateResponse(HttpStatusCode.NotFound);
			}

			var jsonblob = container.GetBlockBlobReference("top250.json");

			if (!(await jsonblob.ExistsAsync()))
			{
				return Request.CreateResponse(HttpStatusCode.NotFound);
			}

			var stream = new MemoryStream();

			await jsonblob.DownloadToStreamAsync(stream);

			stream.Position = 0;

			var result = new HttpResponseMessage(HttpStatusCode.OK)
			{
				Content = new ByteArrayContent(stream.ToArray())
			};

			result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

			return result;
		}
	}
}
