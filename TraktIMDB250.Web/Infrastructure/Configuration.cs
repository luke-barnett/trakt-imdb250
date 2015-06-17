using System.Configuration;

namespace TraktIMDB250.Web.Infrastructure
{
	public static class Configuration
	{
		public static string TraktClientId { get { return ConfigurationManager.AppSettings["TraktClientId"]; } }

		public static string GoogleAnalyticsTrackingCode { get { return ConfigurationManager.AppSettings["GoogleAnalyticsTrackingCode"]; } }
	}
}
