using System;
using DefendX.API.Common.Email.Model;
using Microsoft.AspNetCore.Http;

namespace DefendX.API.Common.Email.Builder
{
    public class EmailBuilderFactory : IEmailBuilderFactory
    {
        public TEmailBuilder GetBuilder(
            string emailType,
            string toEmailAddress,
            string senderName, 
            long senderId,
            string senderEmail,
            string subject, 
            string bodyContent, 
            IFormFile attachment) 
        {
            switch (emailType) {
                case EmailTypes.ACCOUNT_CHANGE :
                    return new AccountChangeEmailBuilder(
                        new EmailRequest(), 
                        toEmailAddress,
                        senderName, 
                        senderId,
                        senderEmail,
                        subject, 
                        bodyContent, 
                        attachment
                    );
                default :
                    throw new ArgumentException("Invalid Email Type");
            }
        }

        public IEmailDirector GetDirector(TEmailBuilder builder)
        {
            return new EmailDirector(builder);
        }
    }
}