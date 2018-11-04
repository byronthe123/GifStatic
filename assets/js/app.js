const root = document.getElementsByTagName( 'html' )[0];

$(document).ready(function(){
    console.log('js online');

    // root.setAttribute('class', 'bg1');
    $('body').addClass('bg1');
    
    let topics = ['Favorites','Deus Ex', 'The Witcher 3', 'Shadow of the Colossus'];

    let in_favorite = false;

    $('#div_favorites').hide();
    
    const loadFavoritesArray = () => {
        if(localStorage.getItem('favorites') !== null) {
            return localStorage.getItem('favorites').split(',');
        } else {
            return [];
        }
    }

    let favorites_array = loadFavoritesArray();

    //Helper Methods:
    const ajax = (searchTerm) => {
        let apiKey = 'eWcnXMOmzcjz90UYkyUhcoyQKUvIefj2';

        let queryURL = `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${apiKey}&limit=10`;

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function(response){
            console.log(response);
            displayGif(response);
        });
    }

    const displayGif = (response) => {
        // $('#div_gifs').append(`<img src='${response.data[0].images.fixed_height.url}'>`);
        // $('#div_gifs').append(`<img static='${response.data[0].images.downsized_still.url}' animation='${response.data[0].images.downsized.url}' src='${response.data[0].images.downsized_still.url}'>`);
        $('body').removeClass('bg1').addClass('bg2');
        // root.setAttribute('background', `url('../images/background2.jpg') no-repeat center center fixed`);

        // $('#div_gifs').empty();

        if (Array.isArray(response)) {
            for(let i = 0; i < response.length; i++) {
                $('#div_favorites').append(response[i]);
            }
        } else {
            for(let i = 0; i < response.data.length; i++) {
                $('#div_gifs').append(`
                    <div class='div_gif text-center d-inline-block'>
                        <span class='add_favorite'>&starf;</span>
                        <img class='gif img-fluid' state='static' rating='${response.data[i].rating}' static='${response.data[i].images.downsized_still.url}' animation='${response.data[i].images.downsized.url}' src='${response.data[i].images.downsized_still.url}'>
                        <h6 class='rating'>${response.data[i].rating}</h6>
                    </div>    
                `);
            }
        }
        window.scrollTo(0, document.body.scrollHeight);
    }

    const displayButtons = () => {
        $('#div_buttons').empty();
        for(let i = 0;  i < topics.length; i++) {
            let $button = '';
            if(topics[i].toLowerCase() === 'favorites') {
                $button = $(`<button data='${topics[i]}' class='btn_favorite btn btn-info mx1'>${topics[i]}</button>`);
            } else {
                $button = $(`<button data='${topics[i]}' class='btn_gif btn btn-dark mx-1'>${topics[i]}</button>`);
            }
            $('#div_buttons').append($button);
        }
    }

    //Display initial buttons:
    displayButtons();
    

    //DOM Events

    //Gif Button Click:
    $(document).on('click', '.btn_gif', function(){
        $('#div_favorites').hide();
        $('#div_gifs').show();
        // console.log($(this).attr('data'));
        in_favorite = false;
        ajax($(this).attr('data'));
    });

    //Favorites Button Click:
    $(document).on('click', '.btn_favorite', function() {
        // console.log($(this).attr('class'));
        if(favorites_array.length < 2) {
            alert('No favorites added!\nClick the star to add to favorites.');
        } else {
            $('body').removeClass('bg1').addClass('bg2');
            $('#div_favorites').empty();
            $('#div_favorites').show();
            $('#div_gifs').hide();
            in_favorite = true;
            displayGif(favorites_array);
        }

    });

    //Click on GIF to play/pause it:
    $(document).on('click', '.gif', function(){
        // console.log($(this));
        let $that = $(this);
        if($that.attr('state') === 'static') {
            $that.attr('state', 'animation');
            $that.attr('src', $that.attr('animation'));
        } else {
            $that.attr('state', 'static');
            $that.attr('src', $that.attr('static'));
        }
    });

    //Click on the Favorite link on a Gif:
    $(document).on('click', '.add_favorite', function() {
        // console.log($(this));
        // console.log($(this).parent().addClass('unfavorite'));
        // console.log($(this).parent());
        // console.log($(this).parent()[0].outerHTML);
        $(this).removeClass('add_favorite').addClass('unfavorite');
        if(favorites_array.indexOf(i => i.val === $(this).parent()[0].outerHTML) === -1) {
            favorites_array.push($(this).parent()[0].outerHTML);
            localStorage.setItem('favorites', favorites_array);
        }
    });

    $(document).on('click', '.unfavorite', function() {
        // console.log($(this).parent());
        $(this).removeClass('unfavorite').addClass('add_favorite');
        favorites_array.splice(favorites_array.indexOf(i => i.val === $(this).parent()[0].outerHTML), 1);
        localStorage.setItem('favorites', favorites_array);
        if(in_favorite) {
            $(this).parent().remove();
        }
    });

    //Click on submit button to create a new topic button:
    $(document).on('click', '#btn_submit', function(e){
        e.preventDefault();
        if($('#in_topic').val().length > 0) {
            topics.push($('#in_topic').val());
            $('#in_topic').val('');
            displayButtons();
        } else {
            alert('Please enter a topic!');
        }
    });
});

