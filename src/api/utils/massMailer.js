function generateEmailToWorkers() {
  const button = `<a href="http://localhost:3000/login" style="background-color:#0057FF;color:#FFFFFF;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Create an account</a>`;
  const emailBody = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation Email</title>
    </head>
    <body style="background-color:#F9F9F9;font-family:'Arial', sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
        <tr>
          <td align="center" style="padding:20px;">
            <h1 style="color:#333;">Hello There</h1>
            <p>You're receiving this email because you have been invited to become an join INTLLAW.</p>
            ${button}
            <p style="color:#424040;font-size:14px;margin-top:20px;">
              If you are not sure why you're receiving this, please contact us by replying to this email.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
  return emailBody;
}
module.exports = generateEmailToWorkers;
