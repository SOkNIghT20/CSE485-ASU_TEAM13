const HTML_TEMPLATE = (text, link, expiry) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Media is Here!</title>
        <style>
          .container {
            width: 100%;
            height: 100%;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .email {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
          }
          .email-header {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .email-body {
            padding: 20px;
          }
          .email-footer {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .disclaimer {
            font-size: 11px;
            color: #999;
            padding: 15px;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            text-align: left;
            line-height: 1.6;
          }
          .disclaimer h4 {
            color: #666;
            font-size: 12px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email">
            <div class="email-header">
              <h1>${text}</h1>
            </div>
            <div class="email-body">
              <p>${link}</p>
            </div>
            <div class="email-footer">
              <p>The link(s) will expire in ${expiry}</p>
              <p>Files will be automatically deleted after 30 days</p>
              <p>If you were not expecting this email or have any questions, please reach out to digiclips.mediatransfer@gmail.com</p>
            </div>
            <div class="disclaimer">
              <h4>Legal Disclaimer - FAIR USE NOTICE</h4>
              <p>This email may contain links to broadcast media content available in the research database provided by DigiClips, Inc. and clipped by the sender of this email. DigiClips is a provider of monitoring and analytics services and research tools only, does not sell, distribute or syndicate content, and does not own the rights in the broadcast media content available in the DigiClips media database.</p>
              <p>The recipient of this email is required to comply with applicable copyright and other laws and may not sell, copy, modify, re-broadcast, distribute, perform or display broadcast media content in any infringing or illegal manner.</p>
              <p>This email is intended for the named recipient only. The recipient is responsible for ensuring that all viewing, storage, sharing and other usage of the content accessible through this email constitutes "fair use" or is otherwise non-infringing under applicable law. If the recipient intends to make any usage of the content that may not constitute "fair use" or otherwise be non-infringing, DigiClips strongly recommends that you contact the relevant rights holder to obtain a suitable license in such content.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = HTML_TEMPLATE;