using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DefendX.API.AppLayer.Services;
using DefendX.API.Common;
using DefendX.API.Common.Email;
using DefendX.API.Common.Email.Builder;
using DefendX.API.Common.Email.Model;
using DefendX.API.DAL.Context;
using DefendX.API.DAL.Repositories;
using DefendX.API.Domain.AggregatesModel;
using DefendX.API.Domain.AggregatesModel.LogAggregate;
using DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate;
using DefendX.API.Domain.AggregatesModel.SofaLicensePrintQueueAggregate;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using DefendX.API.DSL;
using DefendX.API.DSL.DomainMapping;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DefendX.API {
    public class Startup {
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {
            services.AddDbContext<DataContext> (x => x.UseLazyLoadingProxies().UseSqlServer (Configuration.GetConnectionString ("ProductionConnection")));
            services.AddDbContext<LogDataContext> (x => x.UseSqlServer(Configuration.GetConnectionString("LogProductionConnection")));
            services.AddTransient<Seeder> ();
            services.AddTransient<AuthAppService> ();
            services.AddTransient<UsersAppService>();
            services.AddTransient<LicensesAppService>();
            services.AddTransient<AppDataAppService>();
            services.AddTransient<AuthDomainService> ();
            services.AddTransient<LicenseDomainService>();
            services.AddTransient<UserDomainService>();
            services.AddTransient<EmailAppService>();
            services.AddScoped (typeof (IGenericRepository<>), typeof (GenericRepository<>));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUnitRepository, UnitRepository>();
            services.AddScoped<ILicenseRepository, LicenseRepository>();
            services.AddScoped<IPrintQueueRepository, PrintQueueRepository>();
            services.AddScoped<ILogRepository, LogRepository>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor> ();
            services.AddSingleton<DomainMapperCreator>();
            services.AddSingleton<IEmailBuilderFactory, EmailBuilderFactory>();
            services.AddEmail(Configuration);
            services.Configure<EmailAddressesConfig>(Configuration.GetSection("EmailAddresses"));
            services.AddCors ();
            services.AddAutoMapper();
            services.AddMvc ().SetCompatibilityVersion (CompatibilityVersion.Version_2_2).AddJsonOptions(opt =>
            {
              opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;  
            });;

            //TODO used to enfore global HTTPS https://neelbhatt.com/2018/02/04/enforce-ssl-and-use-hsts-in-net-core2-0-net-core-security-part-i/
            // services.Configure (options => {
            //     options.Filters.Add (new RequireHttpsAttribute ());
            // });

            //TODO put in seperate file, all
            var key = Encoding.ASCII.GetBytes (Configuration.GetSection ("AppSettings:Token").Value);
            services.AddAuthentication (JwtBearerDefaults.AuthenticationScheme).AddJwtBearer (options => {
                options.TokenValidationParameters = new TokenValidationParameters {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey (key),
                ValidateIssuer = false,
                ValidateAudience = false
                };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IHostingEnvironment env, Seeder seeder) {
            if (env.IsDevelopment ()) {
                app.UseDeveloperExceptionPage ();
            } else {
                //HTTP Strict Transport Security (HSTS) 
                // app.UseHsts();

                app.UseExceptionHandler (builder => {
                    builder.Run (async context => {
                        context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                        var error = context.Features.Get<IExceptionHandlerFeature> ();
                        if (error != null) {
                            context.Response.AddApplicationError (error.Error.Message);
                            await context.Response.WriteAsync (error.Error.Message);
                        }
                    });
                });
            }

            // seeder.SeedAccountTypes ();
            // seeder.SeedService ();
            // seeder.SeedRank ();
            // seeder.SeedUnits ();
            // seeder.SeedLogEntryTypes();

            app.UseCors (x => x.AllowAnyHeader ().AllowAnyMethod ().AllowAnyOrigin ().AllowCredentials ());
            // app.UseHttpsRedirection();
            app.UseAuthentication ();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseMvc(routes => {
                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Fallback", action ="Index" }
                );
            });
        }
    }
}