$(function() {
    
    var posts = $('#posts');
    var postOffset = - (820 + 80);
    var focusPost = null;
    
    function animatePosts() {
        posts.animate({'left': - focusPost.position().left}, 100);
    }
    
    
    function moveToLeftPost() {
        setFocusPost(focusPost.prev());
    }
    
    function moveToRightPost() {
        setFocusPost(focusPost.next());
    }
    
    
    function setFocusPost(post) {
        if (post == null || post.length == 0) return;
        
        if (focusPost != null) focusPost.removeClass('focus');
        focusPost = post.addClass('focus');
        refreshButtons();
        animatePosts();
    }
    
    function initFocusPost() {
        setFocusPost($('#posts .post:first-child'));
    }
    
    function refreshButtons() {
        if (focusPost == null) return;
        
        $('#newerPostButton').toggleClass('visible', focusPost.prev('.post').length > 0);
        $('#olderPostButton').toggleClass('visible', focusPost.next('.post').length > 0);
    }
    
    
    function init() {
        initFocusPost();
    }
    
    
    
    /* Bindings
    ---------------------------------------------------------------------------*/
    
    $(window).keydown(function(e) {
        
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
    
    
    
    /* Init
    ---------------------------------------------------------------------------*/
    
    init();
});