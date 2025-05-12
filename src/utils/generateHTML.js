export const signUpTemp = (link) => `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Verify Your Email</title>
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Ubuntu+Mono&display=swap" rel="stylesheet">
    <style>
        /* Global Styles */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Ubuntu', sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #1976D2;
            padding: 20px;
            text-align: center;
        }

        .header img {
            max-width: 150px;
            height: auto;
        }

        .content {
            padding: 20px;
            text-align: center;
        }

        .content h1 {
            font-family: 'Ubuntu Mono', monospace;
            font-size: 24px;
            color: #1976D2;
            margin-bottom: 20px;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
        }

        .button {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 24px;
            background-color: #1976D2;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 500;
        }

        .footer {
            background-color: #f1f1f1;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
        }

        .social-icons {
            margin-top: 20px;
        }

        .social-icons a {
            display: inline-block;
            margin: 0 10px;
        }

        .social-icons img {
            width: 24px;
            height: 24px;
        }

        /* Responsive Styles */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                border-radius: 0;
            }

            .content {
                padding: 15px;
            }

            .content h1 {
                font-size: 20px;
            }

            .content p {
                font-size: 14px;
            }

            .button {
                font-size: 14px;
                padding: 10px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <img src="../../public/images/logos/Saraha_transparent-.png" alt="Saraha Logo">
        </div>

        <!-- Content -->
        <div class="content">
            <h1>Thank You for Registering!</h1>
            <p>
                You are just one step away from completing your registration. Activate your account by clicking the button below to start your journey with us. Gain access to exclusive courses, tutorials, and resources!
            </p>
            <a href="${link}" class="button">Verify Email Address</a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; 2025 Saraha. All Rights Reserved.</p>
            <div class="social-icons">
                <a href="https://www.facebook.com/ali.mohamed.11907">
                    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook">
                </a>
                <a href="https://x.com/AliHoms73082453">
                    <img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" alt="Twitter">
                </a>
                <a href="https://www.linkedin.com/in/ali-mohamed-68a0a3239/">
                    <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn">
                </a>
                <a href="https://www.instagram.com/alihomsph/">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram">
                </a>
                <a href="https://github.com/AliMohaamed">
                    <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub">
                </a>
            </div>
        </div>
    </div>
</body>
</html>
`;
