using Microsoft.Azure.WebJobs;

namespace TrakIMDB250.Scraper
{
	class Program
	{
		static void Main(string[] args)
		{
			var config = new JobHostConfiguration();

			var host = new JobHost(config);

			host.Call(typeof(Functions).GetMethod("ScrapeIMDB250"));
		}
	}
}
