var data = {
    projects: [
        {
            artist: 'Forest Swords',
            release: 'Compassion',
            date: 'May 05',
            label: 'Ninja Tune',
            artwork: 'img/packshots/compassion800.jpg',
            track: {
                title: 'title',
                src: 'tracks/track.mp3'
            },
            copy: {
                intro: "&ldquo;Compassion&rdquo; engages with an uncertain world we&rsquo;re experiencing, distilling it into a unique sound territory: Barnes' exploration of the mid-point between ecstasy and frustration, artificial and human feels timely and affecting.",
                main: "The result is an assured, compelling body of work, tying together the ancient and future: weaving swathes of buzzing digital textures, field recordings, clattering beats and distorted jazz sax with fizzing orchestral arrangements."
            },
            quotes: [
                {
                    quote: "Compassion doesn't merely reflect the weeping and gnashing of teeth of our time - it does what it can to sooth and heal. The results are both sincere and sublime",
                    ref: 'Resident Advisor (4.5/5)'
                }
            ],
            buy: 'https://forestswords.lnk.to/compassionEs',
            social: [
                {
                    name: 'Twitter',
                    href: 'http://www.found.ee/forest-tw'
                },
                {
                    name: 'Instagram',
                    href: 'http://www.found.ee/forest-ig'
                },
                {
                    name: 'Facebook',
                    href: 'http://www.found.ee/forest-fb'
                },
                {
                    name: 'Spotify',
                    href: 'http://www.found.ee/forest-sp'
                },
                {
                    name: 'Apple Music',
                    href: 'http://www.found.ee/forest-am'
                }
            ]
        },
        {
            artist: 'Thundercat',
            release: 'Drunk',
            date: 'February 24',
            label: 'Brainfeeder',
            artwork: 'img/packshots/drunk800.jpg',
            track: {
                title: 'title',
                src: 'tracks/track.mp3'
            },
            copy: {
                intro: "&ldquo;Drunk&rdquo;, released on Brainfeeder, is a 23-track epic journey into the often hilarious, sometimes dark mind of the Grammy-winning singer/bassist and finds a few of his friends joining him along the way including: Kendrick Lamar, Pharrell, Michael McDonald, Kenny Loggins, Wiz Khalifa, Kamasi Washington and Brainfeeder mastermind Flying Lotus.",
                main: ""
            },
            quotes: [
                {
                    quote: "Whimsical and somber, funny and meaningful, sometimes all at once...",
                    ref: 'Pitchfork (8.5/10 - Best New Music)'
                }
            ],
            buy: 'https://thundercat.lnk.to/drunkEs',
            social: [
                {
                    name: 'Twitter',
                    href: 'http://found.ee/thundercat-tw'
                },
                {
                    name: 'Spotify',
                    href: 'http://found.ee/thundercat-sp'
                },
                {
                    name: 'Facebook',
                    href: 'http://found.ee/thundercat-fb'
                },
                {
                    name: 'Brainfeeder',
                    href: 'http://brainfeeder.net/thundercat'
                }
            ]
        },
        {
            artist: 'Actress',
            release: 'AZD',
            date: 'April 14',
            label: 'Ninja Tune',
            artwork: 'img/packshots/azd800.jpg',
            track: {
                title: 'title',
                src: 'tracks/track.mp3'
            },
            copy: {
                intro: "2017 saw Actress return with a new music system called &ldquo;AZD&rdquo; (pronounced &ldquo;Azid&rdquo;) on Ninja Tune. The unique creation of a unique mind, the album is a chrome aspect journey into a parallel world.",
                main: "He is an artist who has always preferred to make music rather than to talk about it and in &ldquo;AZD&rdquo; he has achieved another remarkable landmark, one that is as resistant to interpretation as it is demanding of it."
            },
            quotes: [
                {
                    quote: "A brilliantly twisted, introverted take on dance music.",
                    ref: 'The Guardian (4/5 - Album Of The Week)'
                }
            ],
            buy: 'https://actress.lnk.to/azdEs',
            social: [
                {
                    name: 'Twitter',
                    href: 'http://found.ee/actress-tw'
                },
                {
                    name: 'Facebook',
                    href: 'http://found.ee/actress-fb'
                },
                {
                    name: 'Spotify',
                    href: 'http://found.ee/actress-sp'
                }
            ]
        },
        {
            artist: 'UMFANG',
            release: 'Symbolic Use Of Light',
            date: 'June 16',
            label: 'Technicolour',
            artwork: 'img/packshots/symbolic800.jpg',
            track: {
                title: 'title',
                src: 'tracks/track.mp3'
            },
            copy: {
                intro: "Previously sharing her analogue-based rhythmic excursions via videogamemusic, 1080p, Phinery and Allergy Season, the New Yorker is a co-founder of Brooklyn&rsquo;s colossal Discwoman crew and resident at Bossa Nova Civic Club&rsquo;s Technofeminism monthly.",
                main: "She does not like to intellectualise her art, describing her process - recording tracks in live takes - as being rooted in catharsis, release and improvisation rather than any identifiable high-art aim."
            },
            quotes: [
                {
                    quote: "One moment you&rsquo;ve barely registered what she&rsquo;s doing, the next she&rsquo;s burrowed right inside your head&hellip;",
                    ref: 'The Wire'
                }
            ],
            buy: 'https://umfang.lnk.to/suolEs',
            social: [
                {
                    name: 'Twitter',
                    href: 'http://found.ee/umfang-tw'
                },
                {
                    name: 'Facebook',
                    href: 'http://found.ee/umfang-fb'
                },
                {
                    name: 'SoundCloud',
                    href: 'http://found.ee/umfang-sc'
                },
                {
                    name: 'Spotify',
                    href: 'http://found.ee/umfang-sp'
                }
            ]
        }
    ]
}


function loadProjectContent(n, callback) {
    var p = data.projects[n];
    var nextP = data.projects[n+1];
    if (n >= (data.projects.length-1)) nextP = data.projects[0];


    // NUMBER //
    var num = n + 1;
    if (num < 10) num = '0' + num;
    var total = data.projects.length;
    if (total < 10) total = '0' + total;
    var projectNumber = document.getElementById('project-number');
    projectNumber.innerHTML = num;
    projectNumber.setAttribute('data-total', '/ ' + total);


    // HEADLINES //
    document.getElementById('project-title').innerHTML = p.release;
    document.getElementById('project-artist').innerHTML = p.artist;
    document.getElementById('project-date').innerHTML = p.date;

    // LABEL //
    document.getElementById('project-release').innerHTML = 'Released by ' + p.label + '.';

    // PACKSHOT //
    currentProjectArtwork = p.artwork;
    resetPackshot(callback);

    // COPY //
    document.getElementById('copy-intro').innerHTML = p.copy.intro;
    document.getElementById('copy-main').innerHTML = p.copy.main;

    // QUOTES //
    var projectQuotes = document.getElementById('project-quotes');
    projectQuotes.innerHTML = '';
    p.quotes.forEach(function(item) {

        var quoteWrapper = document.createElement('div');
        quoteWrapper.classList = 'c-hidden';
        projectQuotes.appendChild(quoteWrapper);

        var quote = document.createElement('blockquote');
        quote.innerHTML = item.quote;
        quote.classList = 'c-reveal-child';
        quoteWrapper.appendChild(quote);

        var ref = document.createElement('div');
        ref.innerHTML = item.ref;
        ref.classList = 'quote-ref mid c-reveal-child';
        quoteWrapper.appendChild(ref);
    });

    // BUY //
    document.getElementById('project-buy-box').href = p.buy;
    document.getElementById('project-buy-box').setAttribute('data-label', 'Order ' + p.artist + ' - ' + p.release);

    // SOCIAL //
    projectSocial = document.getElementById('project-social');
    projectSocial.innerHTML = 'Follow ' + p.artist + ' on ';
    var l = p.social.length;
    p.social.forEach(function(item, i) {
        var link = document.createElement('a');
        link.href = item.href;
        link.innerHTML = item.name;
        projectSocial.appendChild(link);

        if (i < (l-2)) {
            var grammar = document.createTextNode(', ');
            projectSocial.appendChild(grammar);
        }
        else if (i === (l-2)) {
            var grammar = document.createTextNode(' and ');
            projectSocial.appendChild(grammar);
        } else {
            var grammar = document.createTextNode('.');
            projectSocial.appendChild(grammar);
        }
    });


    // NEXT PROJECT //
    document.getElementById('next-project-artist').innerHTML = nextP.artist;
    document.getElementById('next-project-title').innerHTML = nextP.release;

    // RESET CSS //
    project.scrollTop = 0;
    project.classList.add('open');

    page.classList.add('no-transition');
    index.classList.remove('open');

    packshotWrap.classList.add('no-transition');
    packshotWrap.classList.remove('out');
    packshotWrap.classList.add('in');
    packshotWrap.offsetHeight;
    packshotWrap.classList.remove('no-transition');
    projectRevealElements.forEach(function(item){
        item.classList.add('c-hidden');
    });
}


function loadProject(n) {
    currentProject = n;
    shroud.classList.remove('out');
    setTimeout(function(){
        loadProjectContent(n, function() {
            shroud.classList.add('out');
        });
    },600);
}

function populateIndex() {
    var container = document.getElementById('index-inner');
    container.innerHTML = '';
    data.projects.forEach(function(item, i) {
        var link = document.createElement('a');
        link.setAttribute('data-index',i);
        link.innerHTML = item.artist;
        $(link).click(loadFromIndex);
        container.appendChild(link);
    });
}
