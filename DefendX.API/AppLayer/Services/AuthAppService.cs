using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DefendX.API.AppLayer.DTOs;
using DefendX.API.Common.Utilities.CaC;
using DefendX.API.Domain.AggregatesModel;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using DefendX.API.DSL;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DefendX.API.AppLayer.Services
{
    public class AuthAppService : TAppService
    {
        private AuthDomainService _authDomainService;
        private readonly IConfiguration _config;

        private IMapper _mapper;
        public AuthAppService(
                IHttpContextAccessor accessor, 
                IUserRepository userRepo, 
                AuthDomainService authDomainService,
                IConfiguration config,
                IMapper mapper
                )
                :base(accessor, userRepo)
        {
            _authDomainService = authDomainService;
            _config = config;
            _mapper = mapper;
        }

        public async Task<Tuple<string, UserDTO>> Login()
        {
            var cert = await CacUtility.GetUserCertificate(_accessor.HttpContext);
            var cac = CacUtility.GetCac(cert);

            if(cac.DodId <= 0)
                throw new System.UnauthorizedAccessException("Please provide valid certificate");

            var user = await _userRepo.GetAsync(cac.DodId);
        
            if(user == null) {
               user = await _authDomainService.Register(cac);
            } else {
                user.Account.RefreshLoginDate();
                await _userRepo.SaveAsync();
            }

            return new Tuple<string, UserDTO>(
                GenerateToken(user),
                _mapper.Map<UserDTO>(user)
            );
        } 

        private string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:Token").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.DodId.ToString()),
                        new Claim(ClaimTypes.Name, user.Name.FirstName),
                        new Claim(ClaimTypes.Role, user.Account.AccountType.Type)
                }),
                Expires = DateTime.Now.AddMinutes(15),
                // Expires = DateTime.Now.AddMinutes(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return tokenString;
        }


    }
}