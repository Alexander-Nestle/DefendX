using System.Threading.Tasks;
using DefendX.API.Common.Email.Model;
using MimeKit;
using NETCore.MailKit.Core;

namespace DefendX.API.Common.Email
{
    public interface IAppEmailService : IEmailService
    {
        Task SendAsync(MimeMessage message);
        Task SendAsync(EmailRequest emailRequest);
    }
}