using HtmlAgilityPack;
using Microsoft.Azure.WebJobs;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace TrakIMDB250.Scraper
{
	public class Functions
	{
		[NoAutomaticTrigger]
		public async static Task ScrapeIMDB250(TextWriter log)
		{
			await Log(log, "Starting scrapping of IMDB Top 250");

			var html = new HtmlWeb().Load("http://www.imdb.com/chart/top");

			var chartTable = html.DocumentNode.SelectSingleNode("//table[@class='chart']");

			var movies = GetMovies(chartTable).OrderBy(movie => movie.Rank);

			await Log(log, "Got movies");

			var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["Storage"].ConnectionString);

			var blobClient = storageAccount.CreateCloudBlobClient();

			var container = blobClient.GetContainerReference("imdb-top250");

			await container.CreateIfNotExistsAsync();

			await container.SetPermissionsAsync(new BlobContainerPermissions
				{
					PublicAccess = BlobContainerPublicAccessType.Blob
				});

			var jsonblob = container.GetBlockBlobReference("top250.json");

			await jsonblob.UploadTextAsync(JsonConvert.SerializeObject(movies, Formatting.Indented));

			await Log(log, "Written to blob storage");
		}

		static async Task Log(TextWriter log, string message)
		{
			await log.WriteLineAsync(string.Format("[{0}] {1}", DateTimeOffset.Now, message));
		}

		static IEnumerable<Movie> GetMovies(HtmlNode chartTable)
		{
			foreach (var row in chartTable.SelectNodes(".//tr").Skip(1))
			{
				var title = row.SelectSingleNode("td[@class='titleColumn']");
				var rankSpan = title.SelectSingleNode("span[@name='ir']");
				var seenWidget = row.SelectSingleNode("td/span[@name='ur']/div");

				var name = title.SelectSingleNode("a").InnerText;
				var rank = int.Parse(new string(rankSpan.InnerText.Take(rankSpan.InnerText.Count() - 1).ToArray()));
				var rating = decimal.Parse(rankSpan.GetAttributeValue("data-value", "0"));
				var imdbid = seenWidget.GetAttributeValue("data-titleid", string.Empty);
				var releaseDate = DateTime.Parse(title.SelectSingleNode("span[@name='rd']").GetAttributeValue("data-value", string.Empty));

				yield return new Movie
				{
					Name = name,
					Rank = rank,
					Rating = rating,
					IMDBId = imdbid,
					ReleaseDate = releaseDate
				};
			}
		}
	}
}
