class Movie:
	def __init__(self, rank, title, imdbid, rating):
		self.rank = rank
		self.title = title
		self.imdbid = imdbid
		self.rating = rating

import urllib2
import re
from BeautifulSoup import BeautifulSoup

print "Retrieving IMDB 250..."
html = urllib2.urlopen("http://www.imdb.com/chart/top").read()
print "Processing..."
soup = BeautifulSoup(html)
rows = soup.find('div', id="main").findAll('tr')
movies = []
for n in range(1, len(rows)):
	row = rows[n]
	
	link = row.findAll('a')[0]
	movies.append(Movie(str(n), link.string, "tt" + re.findall(r'tt(.*)/',link['href'])[0], row.findAll('td')[1].findAll('font')[0].string))
f = open('imdb250.json', 'w')
f.write('[')
for n in range(0,len(movies)):
	movie = movies[n]
	f.write('{"rank":"' + movie.rank + '","title":"' + movie.title + '","imdbid":"' + movie.imdbid + '","rating":"' + movie.rating + '" }')
	if(n < len(movies) - 1):
		f.write(',')
f.write(']')
f.close()