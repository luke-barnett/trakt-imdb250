using System;

namespace TrakIMDB250.Scraper
{
	public class Movie
	{
		public string IMDBId { get; set; }

		public int Rank { get; set; }

		public string Name { get; set; }

		public DateTime ReleaseDate { get; set; }

		public int Year { get { return ReleaseDate.Year; } }

		public decimal Rating { get; set; }
	}
}
