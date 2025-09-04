const generateEmailTemplate = ({
  username,
  otp,
  expiryOtp = 2,
  subject = "Verification code",
}) => {
  const logoUrl = "https://i.postimg.cc/GmmvkKSd/logo.png";
  const websiteName = "Sarahah App";
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          text-align: center;
        }
        .logo {
          width: 100px;
          height: 100px;
          margin-bottom: 20px;
        }
        .code {
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 4px;
          color: #333;
          margin: 20px 0;
        }
        .message {
          font-size: 16px;
          color: #666;
          margin-bottom: 20px;
        }
        .footer {
          font-size: 14px;
          color: #aaa;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" src="${logoUrl}" alt="${websiteName}" />
        <h2>${subject}</h2>
        <p>Hello ${username || "User"},</p>
        <p class="message">This code is valid for ${expiryOtp} minutes and is confidential. Do not share it with anyone.</p>
        <div class="code">${otp}</div>
        <div class="footer">
          If you didn’t request this, you can safely ignore this email.<br />
          &copy; ${new Date().getFullYear()} ${websiteName}
        </div>
      </div>
    </body>
    </html>
  `;
};

export default generateEmailTemplate;
