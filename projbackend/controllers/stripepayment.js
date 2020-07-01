const stripe = require("stripe")(
  "sk_test_51GziFMDzexeujdHFMa2B3tHAFcJeBlAjDdFljlijWWP7cTZo1KwsRnBn9ZtlA7NU1Xk0FfnvRqpXjEa64MDUQLGM0027iNloFO"
);
const { v4: uuidv4 } = require("uuid");

exports.makePayment = (req, res) => {
  const { products, token } = req.body;
  console.log("PRODUCTS: ", products);
  console.log("TOKEN:", token);

  let amount = 0;
  products.map((product) => {
    amount = amount + product.price;
  });

  console.log("AMOUNT: ", amount);
  const idempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customerData) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            description: "T-Shirt Purchase",
            customer: customerData.id,
            receipt_email: token.email,
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey: idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    });
};
