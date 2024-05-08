const axios = require("axios");

async function fetchInvoicesByIpAddress(ip, token) {
  try {
    const response = await axios.get(
      `http://localhost:3000/stripe/invoice/${ip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrowing the error to handle it further up the call stack
  }
}

async function fetchInvoiceDataById(invoiceId, token) {
  try {
    const response = await axios.get(
      `http://localhost:3000/stripe/invoice-data/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getPaymentData(ip, token) {
  const invoices = await fetchInvoicesByIpAddress(ip, token);
  if (invoices.length === 0) {
    throw new Error("No invoices found for the given IP address");
  }

  // Handle all invoices found for this IP address
  const invoiceDetailsList = [];
  for (const invoice of invoices) {
    if (!invoice._id) {
      throw new Error("Invoice data is missing an '_id' field");
    }
    const invoiceDetails = await fetchInvoiceDataById(invoice._id, token);
    invoiceDetailsList.push(invoiceDetails);
  }
  return invoiceDetailsList;
}

async function redirectBasedUponSeats(invoiceDataArray, token) {
  for (const data of invoiceDataArray) {
    if (!Array.isArray(data) || data.length < 4) {
      console.error("Invalid invoice data format:", data);
      throw new Error(
        "Invoice data is not correctly formatted or is incomplete."
      );
    }

    const [quantity, email, name, phone] = data;

    if (!email) {
      console.error("Missing email for invoice data:", data);
      throw new Error("Email is required but was not provided.");
    }

    let firstname = "";
    let lastname = "";

    if (name && name.trim().length > 0) {
      const nameArray = name.split(" ");
      firstname = nameArray[0];
      lastname = nameArray.length > 1 ? nameArray[1] : "";
    }

    if (quantity > 1) {
      try {
        const response = await axios.post(
          `http://localhost:3000/root/adminLink`,
          {
            name: firstname,
            lastname: lastname,
            futureAdminMail: email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Admin link response:", response.data);
      } catch (error) {
        console.error("Error creating admin link:", error);
        throw error;
      }
    } else {
      try {
        const response = await axios.post(
          `http://localhost:3000/root/userLink`,
          {
            name: firstname,
            lastname: lastname,
            futureUserMail: email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("User link response:", response.data);
      } catch (error) {
        console.error("Error creating user link:", error);
        throw error;
      }
    }
  }
}

module.exports = { getPaymentData, redirectBasedUponSeats };
