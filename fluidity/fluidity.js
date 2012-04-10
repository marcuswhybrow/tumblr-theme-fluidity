/* Current Bugs

    - AJAX loading of posts by retrieving them from the newer/older page links 
    breaks if a new post is added whilst browsing. This is because the last 
    post on page one will become the first post on page two, and so on.

-------------------------------------------------------------------------------*/

$(function() {
    
    var postLoadTypes = {
        DONT: -1,
        ZERO:0, ONE:1, TWO:2, THREE:3, FOUR:4, FIVE:5, SIX:6, SEVEN:7, EIGHT:8, NINE:9
    };
    var postLoadMargin = postLoadTypes.DONT;
    var postWidth = 820 + 200;
    
    var posts = $('#posts');
    var focusPost = null;
    var nextPageLinkSelector = '#next-page';
    var prevPageLinkSelector = '#prev-page';
    
    var currentPage = window.location.pathname;
    var olderPostsPage = null;
    var newerPostsPage = null;
    
    function insertOlderPosts(data) {
        var olderPosts = data.find('#posts');
        
        if (olderPosts.length > 0) {
            var lastPost = $('#posts .post').last();
            var offset = lastPost.position().left + postWidth;
            
            olderPosts.children('.post').each(function(index, elem) {
                $(elem).css('left', offset + index * postWidth).removeClass('focus');
            });
        
            posts.append(olderPosts.html());
        }
    }
    
    function insertNewerPosts(data) {
        var newerPosts = data.find('#posts');
        
        if (newerPosts.length > 0) {
            var firstPost = $('#posts .post').first();
            var offset = firstPost.position().left - postWidth;
            var maxIndex = newerPosts.children('.post').length - 1;
            
            newerPosts.children('.post').each(function(index, elem) {
                $(elem).css('left', offset - (maxIndex - index) * postWidth).removeClass('focus');
            })
            
            posts.prepend(newerPosts.html());
        }
    }
    
    function loadOlderPosts() {
        // if (olderPostsPage == null) return;
        // $.get(olderPostsPage, insertOlderPosts);
        
        insertOlderPosts($('html').clone());
        
        // TODO: test using a real page load
        
        console.log('loaded older posts: ' + $('#posts .post').length + ' posts total');
    }
    
    function loadNewerPosts() {
        // if (newerPostsPage == null) return;
        // $.get(newerPostsPage, insertNewerPosts);
        
        insertNewerPosts($('html').clone());
        
        console.log('loaded newer posts: ' + $('#posts .post').length + ' posts total');
    }
    
    
    function getOlderPostsPage() {
        var tag = $(nextPageLinkSelector);
        if (tag.length > 0) return tag.attr('href');
    }
    
    function getNewerPostsPage() {
        var tag = $(prevPageLinkSelector);
        if (tag.length > 0) return tag.attr('href');
    }
    
    function animateToFocusPost() {
        $('#posts').animate({
            'left': - $('#posts .post.focus').first().position().left
        }, 100);
    }
    
    
    function moveToLeftPost() {
        setFocusPost(focusPost.prev());
    }
    
    function moveToRightPost() {
        setFocusPost(focusPost.next());
    }
    
    
    function setFocusPost(post) {
        if (post == null || post.length == 0) return;
        
        focusPost = post.addClass('focus').siblings().removeClass('focus').end();
        checkToAddPostsAutomatically();
        refreshButtons();
        animateToFocusPost();
    }
    
    function refreshButtons() {
        if (focusPost == null) return;
        
        $('#newerPostButton').toggleClass('visible', focusPost.prev('.post').length > 0);
        $('#olderPostButton').toggleClass('visible', focusPost.next('.post').length > 0);
    }
    
    function checkToAddPostsAutomatically() {
        if (postLoadMargin == postLoadTypes.DONT) return;
        
        var posts = $('#posts .post');
        var focusPostIndex = posts.index(focusPost);
        if (focusPostIndex == -1) return;
        
        var numPostsLeft = focusPostIndex;
        var numPostsRight = posts.length - focusPostIndex - 1;
        
        if (numPostsLeft <= postLoadMargin) loadNewerPosts();
        if (numPostsRight <= postLoadMargin) loadOlderPosts();
    }
    
    function resizePostsContainer() {
        var posts = $('#posts');
        var maxHeight = Math.max.apply(Math, posts.children('.post').map(function() { return $(this).height(); }).get());
        
        posts.height(maxHeight);
    }
    
    function initPosts() {
        posts.children('.post').each(function(index, element) {
            $(element).css('left', index * postWidth);
        });
        
        setFocusPost($('#posts .post:first-child'));
    }
    
    function introPostsAnimation() {
        var posts = $('#posts');
        var top = posts.position().top;
        
        posts.css({'top': top - 20, 'opacity': 0}).animate({'top': top, 'opacity': 1.0}, 200, 'linear');
    }
    
    function contentAlterations() {
        // Updates video's in video posts to take up 100% of the space, whilst
        // retaining the correct aspect ratio.
        $('#posts .post.video iframe').each(function() {
            var $this = $(this);
            var width = $this.width();
            var height = $this.height();
            
            $this.width('100%');
            $this.height($this.width()/width * height);
        });
    }
    
    
    function init() {
        olderPostsPage = getOlderPostsPage();
        newerPostsPage = getNewerPostsPage();
        initPosts();
        resizePostsContainer();
        
        introPostsAnimation();
    }
    
    
    
    /* Bindings
    ---------------------------------------------------------------------------*/
    
    $(window).keyup(function(e) {
        
        // Left arrow pressed: bring post to the left into focus
        if (e.keyCode == 37) {
            moveToLeftPost();
        }
        
        // Right arrow pressed: bring post to the right into focus
        if (e.keyCode == 39) {
            moveToRightPost();
        }
        
    });
    
    $('#newerPostButton').click(function(e) {
        moveToLeftPost();
    });
    
    $('#olderPostButton').click(function(e) {
        moveToRightPost();
    });
    
    $(window).resize(function(e) {
        resizePostsContainer();
    });
    
    
    
    /* Init
    ---------------------------------------------------------------------------*/
    
    init();
});