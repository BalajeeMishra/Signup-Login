var height = $(".allheader").height() - 10;
$(window).scroll(function () {
  if ($(this).scrollTop() > height) {
    $("#navbar").addClass("sticky");
  } else {
    $("#navbar").removeClass("sticky");
  }
});
console.log("hiii");
