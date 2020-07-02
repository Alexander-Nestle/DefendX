using Microsoft.AspNetCore.Http;

namespace DefendX.API.Common.Email.Builder
{
    public interface IEmailBuilderFactory
    {
         TEmailBuilder GetBuilder( 
            string emailType,
            string toEmailAddress,
            string senderName, 
            long senderId,
            string senderEmail,
            string subject, 
            string bodyContent, 
            IFormFile attachment);
        
        IEmailDirector GetDirector(TEmailBuilder builder);
    }
}