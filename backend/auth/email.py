from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME="careercompass.system@gmail.com",
    MAIL_PASSWORD="weqatkowaniorogu",
    MAIL_FROM="Career Compass <careercompass.system@gmail.com>",
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_login_email(email: EmailStr, name: str):
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table width="600" style="background:#ffffff; padding:25px; border-radius:8px;">
                
                <tr>
                  <td style="text-align:center;">
                    <h2 style="color:#2563eb;">Career Compass</h2>
                    <p style="color:#555;">Your career navigation partner</p>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p>Hi <strong>{name}</strong>,</p>
                    <p>
                      Welcome to <strong>Career Compass</strong>!  
                      You have successfully logged in to your account.
                    </p>

                    <p>
                      With Career Compass, you can:
                      <ul>
                        <li>Analyze your resume with ATS scoring</li>
                        <li>Discover skill gaps</li>
                        <li>Get personalized job recommendations</li>
                      </ul>
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <a href="http://localhost:3000"
                         style="background:#2563eb; color:white; padding:12px 22px;
                                text-decoration:none; border-radius:6px;">
                        Go to Career Compass
                      </a>
                    </div>

                    <p style="font-size:14px; color:#666;">
                      If this wasn’t you, please secure your account immediately.
                    </p>

                    <p>Happy learning,<br/>
                    <strong>Career Compass Team</strong></p>
                  </td>
                </tr>

                <tr>
                  <td style="border-top:1px solid #e5e7eb; padding-top:15px;
                             font-size:12px; color:#999; text-align:center;">
                    © 2026 Career Compass. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """

    message = MessageSchema(
        subject="Welcome to Career Compass 👋",
        recipients=[email],
        body=html_content,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
