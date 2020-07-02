using System.IO;
using System.Threading.Tasks;
using DefendX.API.Common.Email.Model;
using MimeKit;
using NETCore.MailKit;
using NETCore.MailKit.Core;

namespace DefendX.API.Common.Email
{
    public class AppEmailService : EmailService, IAppEmailService
    {
        private readonly IMailKitProvider _mailKitProvider; 
        public AppEmailService(IMailKitProvider provider) : base(provider)
        {
            _mailKitProvider = provider; 
        }
        public async Task SendAsync(MimeMessage message)
        {
            message.From.Add(new MailboxAddress(_mailKitProvider.Options.SenderEmail));
            using (var emailClient = _mailKitProvider.SmtpClient)
            {
                if (!emailClient.IsConnected)
                {
                    await emailClient.AuthenticateAsync(_mailKitProvider.Options.Account, 
                    _mailKitProvider.Options.Password);
                    await emailClient.ConnectAsync(_mailKitProvider.Options.Server, _mailKitProvider.Options.Port, _mailKitProvider.Options.Security);
                }
                await emailClient.SendAsync(message);
                await emailClient.DisconnectAsync(true);
            }
        }
    
        public async Task SendAsync(EmailRequest emailRequest)
        {
            MimeMessage mimeMessage = new MimeMessage();
            mimeMessage.To.Add(new MailboxAddress(emailRequest.ToAddress));
            mimeMessage.Subject = emailRequest.Subject;
            var builder = new BodyBuilder { HtmlBody = emailRequest.Body };
            if ( emailRequest.Attachment != null)
            { 
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    await emailRequest.Attachment.CopyToAsync(memoryStream);
                    builder.Attachments.Add(emailRequest.Attachment.FileName, memoryStream.ToArray());
                }

            }

        //   if (emailRequest.LinkedImage != null)
        //   {
        //     var image = builder.LinkedResources.Add (emailRequest.LinkedImage);
        //     image.ContentId = emailRequest.LinkedImage;
        //   }

            mimeMessage.Body = builder.ToMessageBody();
            await SendAsync(mimeMessage);
        }

    }
}