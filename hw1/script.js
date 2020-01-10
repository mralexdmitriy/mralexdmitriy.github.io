// var query_array = ["query1", "query2", "quesry3"]

var query_array = ["\"All successful men and women are big dreamers. They imagine what their future could be, ideal in every respect, and then \
they work every day toward their distant vision, that goal or purpose.\" – Brian Tracy",
"\"I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.\" ― Marilyn Monroe",
"\"Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.\" ― H. Jackson Brown Jr.",
 "\"The opposite of love is not hate, it's indifference. The opposite of art is not ugliness, it's indifference. The opposite of faith is not heresy, it's indifference. And the opposite of life is not death, it's indifference.\" ― Elie Wiesel"]
var index = 0
var query_cont = query_array.length


function myFunction() {
  index = index + 1
  if (index > query_cont-1) {
    index = 0
  }
  document.getElementById("inner").innerHTML = query_array[index];
}
