namespace TraktIMDB250.Web.Models
{
	public class ScriptsModel
	{
		public object JSON { get; set; }

		public string[] Scripts { get; set; }

		public ScriptsModel(object JSON, string[] Scripts)
		{
			this.JSON = JSON;
			this.Scripts = Scripts;
		}
	}
}
