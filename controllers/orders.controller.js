const Order = require('../models/order.model');
const User = require('../models/user.model');
const stripe = require('stripe')('sk_test_51Pqe9IHsh2xbhQsjQYr5YEliBweZEphD583U9n2wvPajNwMV9HRjxgdkTMW37JhfSWr32jBzsHG2Bh0UQt9tT7jT00ra72LNJh');


async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map( function (item) {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price.toFixed(2) * 100
        },
        quantity: item.quantity,
      }
    }),
    mode: 'payment',
    success_url: 'http://localhost:3000/orders/success',
    cancel_url: 'http://localhost:3000/orders/failure',
  });

  res.redirect(303, session.url);

  res.redirect('/orders');
}

function getSuccess(req, res) {
  res.render('customer/orders/success');
}

function getFailure(req, res) {
  res.render('customer/orders/failure');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure
};
