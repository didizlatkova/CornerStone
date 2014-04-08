$(function () {
    $(".tool").click(function () {
        var data = $(this);

        $(".tool").removeClass("active");

        data.addClass("active");
    });
});