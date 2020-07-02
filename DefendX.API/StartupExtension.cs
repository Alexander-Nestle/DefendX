using System;
using DefendX.API.Common.Email;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NETCore.MailKit.Extensions;
using NETCore.MailKit.Infrastructure.Internal;

namespace DefendX.API
{
    // AddEmail is an extension method. 
    public static class StartupExtensions
    {
        public static IServiceCollection AddEmail(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddMailKit(optionBuilder =>
            {
                var mailKitOptions = new MailKitOptions()
                {
                    // get options from secrets.json 
                    Server = configuration.GetValue<string>("Email:Server"),
                    Port = configuration.GetValue<int>("Email:Port"),
                    SenderName = configuration.GetValue<string>("Email:SenderName"),
                    SenderEmail = configuration.GetValue<string>("Email:SenderEmail"),
                    // can be optional with no authentication 
                    Account = configuration.GetValue<string>("Email:Account"),
                    Password = configuration.GetValue<string>("Email:Password"),
                    Security = configuration.GetValue<bool>("Email:Security")
                };

                if (mailKitOptions.Server == null)
                {
                    throw new InvalidOperationException("Please specify SmtpServer in appsettings");
                }
                if (mailKitOptions.Port == 0)
                {
                    throw new InvalidOperationException("Please specify Smtp port in appsettings");
                }
                if (mailKitOptions.SenderEmail == null)
                {
                    throw new InvalidOperationException("Please specify SenderEmail in appsettings");
                }
                
                optionBuilder.UseMailKit(mailKitOptions);
            });
            services.AddScoped<IAppEmailService, AppEmailService>();
            return services;
        }
    }
}