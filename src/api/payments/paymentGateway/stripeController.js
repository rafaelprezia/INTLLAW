// stripeController.js
const Stripe = require("stripe");
const Invoice = require("../../../models/payment");
const stripe = Stripe(
  "sk_test_51P9A0oRpDLUrwZGkhEZvQXgQoa91nfrlK925WoUp2vaVmubhaIo1eWVHIKukO5f7dmLXXXP0n8dBdSDdGmrJ3gat00tCGfiQYe"
);

exports.fetchAllCharges = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({
        error:
          "Invalid limit. Please specify a positive integer value for the limit.",
      });
    }

    // Fetch charges from Stripe with specified limit
    const stripeCharges = await stripe.charges.list({ limit });
    const charges = stripeCharges.data;

    // Fetch related invoices and their line items for each charge
    const chargesWithLineItems = await Promise.all(
      charges.map(async (charge) => {
        const invoice = charge.invoice
          ? await stripe.invoices.retrieve(charge.invoice)
          : null;
        const lineItems = invoice
          ? await stripe.invoices.listLineItems(invoice.id)
          : [];

        return {
          ...charge,
          amount: (charge.amount / 100).toFixed(2),
          amount_captured: (charge.amount_captured / 100).toFixed(2),
          amount_refunded: (charge.amount_refunded / 100).toFixed(2),
          line_items: lineItems.data.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: (item.price.unit_amount / 100).toFixed(2), // Convert unit price from cents to dollars
          })),
        };
      })
    );

    // Return the charges with their associated line items
    res.status(200).json(chargesWithLineItems);
  } catch (error) {
    console.error("Error fetching charges and line items:", error);
    res.status(500).send("Failed to retrieve charges and line items");
  }
};
exports.storeInvoiceChargeAndLineItems = async (req, res) => {
  const invoiceId = req.body.invoiceId; // Expect an invoice ID in the request body
  try {
    if (!invoiceId || !invoiceId.startsWith("in_")) {
      return res.status(400).json({ error: "Invalid or missing invoice ID" });
    }

    // Retrieve the invoice from Stripe
    const invoice = await stripe.invoices.retrieve(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Retrieve line items for this invoice
    const lineItems = await stripe.invoices.listLineItems(invoiceId);

    // Extract relevant line item data
    const extractedLineItems = lineItems.data.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: (item.price.unit_amount / 100).toFixed(2), // Convert from cents to dollars
    }));

    // Optionally retrieve related charge if needed
    let charge = null;
    if (invoice.charge) {
      try {
        charge = await stripe.charges.retrieve(invoice.charge);
      } catch (chargeError) {
        console.error("Error retrieving charge:", chargeError);
        // Optionally handle this error differently or ignore if charge is not critical
      }
    }

    // Create an object that includes invoice, charge, and line item information
    const invoiceChargeLineItems = {
      invoiceData: invoice,
      chargeData: charge, // This will be null if no charge was retrieved or if there was an error
      lineItems: extractedLineItems,
    };

    // Save to MongoDB
    const newInvoiceEntry = new Invoice({
      invoiceData: invoiceChargeLineItems,
    });
    await newInvoiceEntry.save();

    res.status(201).json({
      message: "Invoice, charge, and line items stored successfully",
      data: newInvoiceEntry,
    });
  } catch (error) {
    console.error("Error storing the invoice, charge, and line items:", error);
    res.status(500).send({
      message: "Failed to store the invoice, charge, and line items",
      error: error.message,
    });
  }
};
