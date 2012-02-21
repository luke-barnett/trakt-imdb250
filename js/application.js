var API_KEY = "";
var _imdb250 = new Array();
var _loggedIn = false;
var _username;

function Movie(imdbid, title, year, rank, rating){
	var _imdbid = imdbid;
	var _title = title;
    var _year = year;
	var _rank = rank;
	var _rating = rating;
	var _watched = false;
	var _collection = false;
	var _tick = "<span class='icon tick'>&#10003;</span>";
	var _cross = "<span class='icon cross'>&#215;</span>";
	
	this.IMDBID =  function(){
		return _imdbid;
	}
	
	this.Title = function(){
		return _title;
	}
    
    this.Year = function(){
		return _year;
	}
	
	this.Rank = function(){
		return _rank;
	}
	
	this.Rating = function(){
		return _rating;
	}
	
	this.Watched = function(){
		return _watched;
	}
	
	this.WatchedString = function(){
		if(_watched)
			return _tick;
		return _cross;
	}
	
	this.CollectionString = function(){
		if(_collection)
			return _tick;
		return _cross;
	}
	
	this.Collection = function(){
		return _collection;
	}
	
	this.setWatched = function(watchedStatus){
		_watched = watchedStatus;
	}
	
	this.setCollection = function(collectionStatus){
		_collection = collectionStatus;
	}
	
	this.LinkedTitle = function(){
		return '<a href="http://trakt.tv/search?q=imdb:' + this.IMDBID() + '" target="_blank">' + this.Title() + '</a>';
	}
	
	this.WatchedImage = function(){
		if(_watched)
		{
			return '<img src="assets/images/checked.svg" alt="checked" title="checked">';
		}
		return "";
	}
	
	this.createDOMElement = function(){
		root = $('<tr></tr>');
		root.append('<td>'+this.Rank()+'</td>');
		root.append('<td>'+this.LinkedTitle()+'</td>');
        root.append('<td>'+this.Year()+'</td>');
		root.append('<td>'+this.Rating()+'</td>');
		root.append('<td>'+this.WatchedString()+'</td>');
		root.append('<td>'+this.CollectionString()+'</td>');
		return root;
	}
	
	this.createNextMovieElement = function(){
		root = $('<p></p>');
		root.append($('<h1></h1>').append(this.LinkedTitle()).append($('<small></small>').append(" Rank: " + this.Rank())));
		return root;
	}
}

$(document).ready(function() {
	$("#btnTraktLogin").click( function()
    {
		checkLogin();
		return false;
	});
	
	$("#btnTraktClear").click( function()
    {
		$("#traktusername").val("");
	});
	
	$("#btnLogOut").click( function()
    {
		$.each(_imdb250, function(key, value) {
			value.setWatched(false);
			value.setCollection(false);
		});
		_loggedIn = false;
		enableLoginButtons();
		$('#logOutPanel').slideUp(1000);
		$('#nextMovie').slideUp(1000);
		$('#nextMovieCollection').slideUp(1000);
		$('#loadingTraktCollection').slideUp(1000);
		$("#notificationbar").slideUp(1000);
		$("#notification").empty();
		$("#imdb250").hide();
		$('#traktlogin').slideDown(1000);
	});
	
	$('#btnRefresh').click( function()
	{
		$('#btnRefresh').attr("disabled","");
		$('#nextMovie').slideUp(1000);
		$('#nextMovieCollection').slideUp(1000);
		$("#imdb250").hide();
		$("#notification").empty();
		$("#notificationbar").slideUp(1000);
		getTraktCollection(_username);
	});
	
	$('#inputForm').submit( function()
	{
		checkLogin();
		return false;
	});
	
	$("#moviesTable").tablesorter();
	
	disableLoginButtons();
	if(API_KEY != "")
	{
		getIMDB250();
		
		var urlParams = {};
		(function () {
			var e,
			a = /\+/g,  // Regex for replacing addition symbol with a space
			r = /([^&=]+)=?([^&]*)/g,
			d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
			q = window.location.search.substring(1);
			while (e = r.exec(q))
				urlParams[d(e[1])] = d(e[2]);
		})();
		
		var urlPassedUsername = urlParams["traktusername"];
		if(urlPassedUsername != "")
		{
			$("#traktusername").val(urlPassedUsername);
			checkLogin();
		}
	}
	else
	{
		var notification = $('<div></div>');
		notification.attr('class','alert alert-error');
		var message = $('<span></span>').append($('<strong></strong>').append("Oh Snap!"));
		message.append(' API KEY IS MISSING.');
		notification.append(message);
		$("#notification").append(notification);
		$("#notificationbar").slideDown(1000);
	}
});

function enableLoginButtons(){
	$("#btnTraktLogin").removeAttr("disabled");
	$("#btnTraktClear").removeAttr("disabled");
	$("#traktusername").removeAttr("disabled");
}

function disableLoginButtons(){
	$("#btnTraktLogin").attr("disabled","");
	$("#btnTraktClear").attr("disabled","");
	$("#traktusername").attr("disabled","");
}

function checkLogin(){
	if($("#traktusername").val() == "")
	{
		$('#usernameWrapper').addClass('error');
		$('#usernameHelp').show();
		return
	}
	else
	{
		$('#usernameWrapper').removeClass('error');
		$('#usernameHelp').hide();
	}

	if(!$("btnTraktLogin").is('disabled'))
	{
		disableLoginButtons();
		$("#notificationbar").slideUp(1000);
		$("#notification").empty();
		$("#loginloader").show();
		_username = $("#traktusername").val();
		_loggedIn = true;
		
		$('#usernameDisplay').text(_username);
		$('#traktlogin').slideUp(1000);
		$('#logOutPanel').slideDown(1000);
		$('#btnRefresh').attr("disabled","");
		getTraktCollection(_username);
	}
}

function getTraktCollection(traktUsername){
	$('#loadingTraktCollection').slideDown(1000);
	$.ajax({
		url: 'http://api.trakt.tv/user/library/movies/all.json/'+ API_KEY +'/' + traktUsername,
		type: 'GET',
		dataType: 'jsonp',
		timeout : 10000,
		success: function(response) { processTraktCollection(response); },
		error: function() {
			var notification = $('<div></div>');
			notification.attr('class','alert alert-error');
			var message = $('<span></span>').append($('<strong></strong>').append("Oh Snap!"));
			message.append(' Failed to get movie collection from Trakt.');
			notification.append(message);
			$("#notification").append(notification);
			$("#notificationbar").slideDown(1000);
			_loggedIn = false;
			enableLoginButtons();
			$('#logOutPanel').slideUp(1000);
			$('#nextMovie').slideUp(1000);
			$('#nextMovieCollection').slideUp(1000);
			$('#loadingTraktCollection').slideUp(1000);
			$("#imdb250").hide();
			$('#traktlogin').slideDown(1000);
		}
	});
}

function processTraktCollection(traktMovies){
	if(!_loggedIn)
		return;
	if(traktMovies.length == 0)
	{
		var notification = $('<div></div>');
		notification.attr('class','alert alert-block');
		var message = $('<span></span>').append($('<strong></strong>').append("Oh dear!"));
		message.append(' Your collection is empty. This is normally caused by a <a href="http://trakt.tv/settings/account" target="_blank">private profile</a>. (You can always change it back later)');
		notification.append(message);
		$("#notification").empty();
		$("#notification").append(notification);
		$("#notificationbar").slideDown(1000);
		$('#loadingTraktCollection').slideUp(1000);
		$('#btnRefresh').removeAttr("disabled");
		return;
	}
	$.each(_imdb250, function(key, value) {
		if(traktMovies.length == 0){
			return;
		}
		for(var i = 0; i < traktMovies.length; i++){
			if(traktMovies[i].imdb_id == value.IMDBID())
			{
				if(traktMovies[i].plays > 0){
					value.setWatched(true);
				}
				if(traktMovies[i].in_collection){
					value.setCollection(true);
				}
				traktMovies.splice(i,1);
				break;
			}
		}
	});
	refreshMovies();
	$('#btnRefresh').removeAttr("disabled");
	$('#loadingTraktCollection').slideUp(1000);
	$("#imdb250").slideDown(3000);
}

function getIMDB250(){
	$("#loadingimdb250").slideDown(1000);
	$.ajax({
		url: "data/imdb250.json",
		dataType: "json",
		success: function(movies) {
			$.each(movies, function(key, value) {
				_imdb250.push(new Movie(value.imdbid,value.title,value.year,value.rank,value.rating));
			});
			enableLoginButtons();
			$("#loadingimdb250").slideUp(1000);
		},
		error : function() {
			var notification = $('<div></div>');
			notification.attr('class','alert alert-error');
			var message = $('<span></span>').append($('<strong></strong>').append("Oh Snap!"));
			message.append(' Failed to retrieve IMDB 250.');
			notification.append(message);
			$("#notification").append(notification);
			$("#notificationbar").slideDown(1000);
		}
	});
}

function refreshMovies(){
	var first = true;
	var firstInCollection = true;
	$('#movies').empty();
	$.each(_imdb250, function(key, value) {
		if(first && !value.Watched())
		{
			setNextMovie(value);
			first = false;
		}
		if(firstInCollection && !value.Watched() && value.Collection())
		{
			setNextMovieCollection(value);
			firstInCollection = false;
		}
		$('#movies').append(value.createDOMElement());
	});
	$("table").trigger("update");
	
}

function setNextMovie(movie){
	if(_loggedIn)
	{
		$('#nextMovieDetails').empty();
		$('#nextMovieDetails').append(movie.createNextMovieElement());
		$('#nextMovieDetails').append(getIMDB250Progress());
		
		$('#nextMovie').slideDown(1000);
	}
}

function setNextMovieCollection(movie){
	if(_loggedIn)
	{
		$('#nextMovieCollectionDetails').empty();
		$('#nextMovieCollectionDetails').append(movie.createNextMovieElement());
		
		$('#nextMovieCollection').slideDown(1000);
	}
}

function getIMDB250Progress(){
	var root = $('<p></p>');
	var watchedCount = 0;
	$.each(_imdb250, function(key, value) {
		if(value.Watched())
		{
			watchedCount += 1;
		}
	});
	var watchedPercentage = (watchedCount / 250 * 100);
	root.append('You have watched ' + watchedCount + ' of the IMDB 250 (' + Math.round(watchedPercentage * 10) / 10 + '%)');
	return root;
}

function getParameterByName(name){
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if(results == null)
		return "";
	else
		return +(results[1].replace(/\+/g, " "));
}