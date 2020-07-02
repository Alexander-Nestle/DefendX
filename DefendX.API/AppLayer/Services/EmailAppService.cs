using System;
using System.Threading.Tasks;
using DefendX.API.AppLayer.DTOs;
using DefendX.API.Common.Email;
using DefendX.API.Common.Email.Builder;
using DefendX.API.Common.Email.Model;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DefendX.API.AppLayer.Services
{
    public class EmailAppService : TAppService
    {
        private IOptions<EmailAddressesConfig> _emailConfig;
        private IEmailBuilderFactory _emailBuilderFactory;
        private IAppEmailService _appEmailService;
        public EmailAppService(
            IUserRepository userRepo, 
            IHttpContextAccessor accessor,
            IOptions<EmailAddressesConfig> emailConfig,
            IEmailBuilderFactory emailBuilderFactory,
            IAppEmailService appEmailService
        ):base(accessor, userRepo)
        {
            this._emailConfig = emailConfig;
            this._emailBuilderFactory = emailBuilderFactory;
            this._appEmailService = appEmailService;
        }
        
        public async Task<EmailRequest> SendAccountChange(AccountTypeChangeRequestDTO changeRequest)
        {
            var user = await this._userRepo.Get(GetCurrentUserId());

            if (user == null)
                throw new ArgumentException("Invalid User");

            var builder = _emailBuilderFactory.GetBuilder(
                EmailTypes.ACCOUNT_CHANGE,
                _emailConfig.Value.PassAndId,
                string.Format("{0} {1}", user.Name.FirstName, user.Name.LastName),
                user.DodId,
                changeRequest.EmailAddress,
                changeRequest.AccountTypeName,
                changeRequest.Justification,
                changeRequest.Attachment);

            var emailDirector = _emailBuilderFactory.GetDirector(builder);
            emailDirector.BuildEmailRequest();
            var emailRequest = emailDirector.GetEmailRequest();
            await this._appEmailService.SendAsync(emailRequest);
            return emailRequest;
        }
    }
}