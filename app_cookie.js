var express = require('express');
var app = express(); // cookie 기능을 가지고 있지 않음.
var cookieParser = require('cookie-parser'); // cookie 값을 사용할때 붙이는 미들웨어

app.use(cookieParser());

var products = {
  1: {title: 'super mouse'},
  2: {title: 'super computer'}
};

app.get('/products', function(req, res){
  var output = '';
  for(var name in products){
    output += `
      <li>
        <a href="/cart/${name}">${products[name].title}</a>
      </li>
    `;
  }
  res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`)
});

/*
cart = (제품id : 갯수)

 cart = {
  1:2,
  2:1,
  3:42
}
*/
app.get('/cart/:id', function(req, res){
  var id = req.params.id;
  var cart;
  if(req.cookies.cart)
  {
    cart = req.cookies.cart;
  }
  else
  {
    cart = {};
  }

  if(!cart[id])
  {
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id])+1;
  res.cookie('cart', cart);
  res.redirect('/cart');
});

app.get('/cart', function(req, res){
  var carts = req.cookies.cart;
  if(!carts)
  {
    res.send('Empty carts!');
  }
  else
  {
    var output='';
    for(var cart in carts)
    {
      output += `
        <li>${products[cart].title} : ${carts[cart]}개</li>
        `;
    }
  }
  res.send(`<h1>Cart</h1><ul>${output}</ul><a href="products">Products List</a>`);
});

app.get('/count', function(req, res){

  var cookie_count = parseInt(req.cookies.count);

  if(cookie_count){
    //cookie_count++;
    cookie_count+=1;
  }
  else{
    cookie_count = 1;
  }

  res.cookie('count', cookie_count);
  res.send('Count : ' + cookie_count);
});

app.listen(3000, function(){
  console.log('Connect 3000 port');
});
