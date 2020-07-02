using DefendX.API.Common.Email.Model;

namespace DefendX.API.Common.Email.Builder
{
    public interface IEmailDirector
    {
        EmailRequest GetEmailRequest();
        void BuildEmailRequest();
    }
}