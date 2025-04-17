const createCheckoutSession = async (req, res) => {
    const customerId = req.user.sub; // ← this is from Cognito
  
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }],
      metadata: { customerId }, // ✅ this is what gets passed to webhook
      success_url: 'http://localhost:3000/payment-success',
      cancel_url: 'http://localhost:3000/payment-cancelled'
    });
  
    res.json({ url: session.url });
  };
  