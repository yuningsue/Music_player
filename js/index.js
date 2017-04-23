$(document).ready(function(e) {

	$('.icon-right').on('click', function() {
		$('.right__panel').toggleClass('display');
        $('.player').removeClass('display');
	});

	$('.close').on('click', function() {
		$('.player').toggleClass('display');
		$('.right__panel').removeClass('display');
		$('.music__menu').removeClass('menu_list_open');
	});


});


function getInitialTracks(a) {
    SC.get("/tracks", {
        genres: "electronic"
    }).then(function(r) {
        trackAmount = r.length - 1, handleData(r[a])
        var tmp = '';
        for (var i = 0; i < r.length; i++) {
          tmp = '<a href="' + r[i].permalink_url + '">' + r[i].title + '</a>';
        $("<ul/>").html(tmp).appendTo("#track-list");
      }        
    })
}

function getTracks(a) {
    SC.get("/tracks", {
        genres: "electronic"
    }).then(function(r) {
        trackAmount = r.length - 1, handleData(r[a])
              
    })
}

function Track(a) {
    var r = a.artwork_url;
    this.ID = a.id, this.cover = r.replace("large", "crop"), this.name = a.title, this.duration = a.duration, this.love = a.likes_count, this.link = a.permalink_url, this.musicgenre = a.genre, this.waveform = a.waveform_url, this.userAvatar = a.user.avatar_url, this.userLink = a.user.permalink_url, this.userName = a.user.username, this.description = a.description
}
function handleData(a) {
    track = new Track(a), attachToPlayer(track), SC.stream("/tracks/" + track.ID).then(function(a) {
        SC.player = a
    })
}
function attachToPlayer(a) {
    $(".cover .inner").css({
        "background-color": "#000000",
        "background-image": "url(" + a.cover + ")"
    }), $("<img/>").attr("src", a.cover).on("load", function() {
        $(".player").addClass("loaded"), $(".loading").addClass("closed"), $(".right__panel").addClass("loaded")
    }), $(".loved").html('<i class="fa fa-heart" aria-hidden="true"></i> ' + a.love), $(".user-avatar").html('<a href="' + a.userLink + '" target=_blank><img src="' + a.userAvatar + '" alt="' + a.userName + '"></a>'), $(".info").html('<p><a class="userName" href="' + a.userLink + '" target=_blank>' + a.userName + '</a></br><a class="trackName" href="' + a.link + '" target="_black">' + a.name + "</a></p>"), $(".wave-form").css({
        "background-image": "url(" + a.waveform + ")"}), $(".description").html(a.description), $(".musicgenre").html(a.musicgenre)
}
function trackPlay() {
    playing = !0, SC.player.play(), $(".controls").addClass("playing"), $(".waves").addClass("animate"), $("span.play").html('<i class="fa fa-pause" aria-hidden="true"></i>')
}
function trackPause() {
    playing = !1, SC.player.pause(), $(".controls").removeClass("playing"), $(".waves").removeClass("animate"), $("span.play").html('<i class="fa fa-play" aria-hidden="true"></i>')
}
function trackResetTimer() {
    timer = 0, $(".wave-overlay").css({
        width: "0"
    }), SC.player.seek(timer)
}
function trackNext() {
    trackPause(), trackNumber === trackAmount ? trackNumber = 0 : trackNumber++, getTracks(trackNumber), setTimeout(function() {
        trackPlay(), trackResetTimer()
    }, 100)
}
function trackPrev() {
    trackPause(), 0 === trackNumber ? trackNumber = trackAmount : trackNumber--, getTracks(trackNumber), setTimeout(function() {
        trackPlay(), trackResetTimer()
    }, 100)
}
var clientID = "nEUgbh6lRJ7mvPdBvWrL33FaKJJGtxFt",
    url = "https://soundcloud.com/officialhipst3r/the-chainsmokers-dont-let-me-down-ft-daya-hipster-edit",
    queryURL = {
        url: url,
        client_id: clientID
    },
    track = null,
    playing = !1,
    timer = 0,
    trackNumber = 0,
    trackAmount = null,
    interval = null;
SC.initialize({
    client_id: clientID
}), getInitialTracks(trackNumber), $(".controls").on("click", function() {
    0 == playing ? trackPlay() : 1 == playing && trackPause()
}), $(".next").on("click", function(a) {
    a.stopPropagation(), trackNext()
}), $(".prev").on("click", function(a) {
    a.stopPropagation(), trackPrev()
}), $(".wave-form").on("click", function(a) {
    var r = $(this).width(),
        t = a.pageX - $(this).offset().left,
        e = 100 * t / r,
        n = track.duration / 100 * e;
    SC.player.seek(n), timer = n, $(".wave-overlay").css({
        width: e + "%"
    })
}), setInterval(function() {
    1 == playing && (timer += 1e3);
    var a = 100 * timer / track.duration;
    $(".wave-overlay").css({
        width: a + "%"
    }), a >= 100 && trackNext()
}, 1e3);