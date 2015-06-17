using System;
using System.Configuration;

namespace TraktIMDB250.Web.Infrastructure
{
	public static class Configuration
	{
		public static string TraktClientId
		{
			get
			{
				return ConfigurationManager.AppSettings["TraktClientId"];
			}
		}
	}
}