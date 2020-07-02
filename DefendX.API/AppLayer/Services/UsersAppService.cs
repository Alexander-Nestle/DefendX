using System.Collections.Generic;
using System.Threading.Tasks;
using DefendX.API.Domain.AggregatesModel;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using DefendX.API.AppLayer.Params;
using Microsoft.AspNetCore.Http;
using DefendX.API.Common;
using System.Security.Authentication;
using DefendX.API.AppLayer.DTOs;
using System;
using AutoMapper;
using DefendX.API.DSL;
using DefendX.API.DAL.Models.Pagination;
using DefendX.API.DSL.DomainMapping;

namespace DefendX.API.AppLayer.Services
{
    public class UsersAppService : TAppService
    {
        private IMapper _autoMapper;
        private DomainMapperCreator _domainMapper;
        private UserDomainService _userDomainService;
        public UsersAppService(
            IUserRepository userRepo, 
            IHttpContextAccessor accessor,
            IMapper mapper,
            UserDomainService userDomainService,
            DomainMapperCreator domainMapper
            ):base(accessor, userRepo)
        {
            _autoMapper = mapper;
            _userDomainService = userDomainService;
            _domainMapper = domainMapper;
        }

        public async Task<IEnumerable<User>> GetUsers() => await _userRepo.GetAsync();
        public async Task<ViewUserDTO> GetUser(long id) 
        {
            return _autoMapper.Map<ViewUserDTO>(await _userDomainService.GetUser(GetCurrentUserId(), id));
        }

        public async Task<UserDTO> UpdateUser(UserUpdateDTO userDto)
        {
            var userToUpdate = await _userRepo.GetAsync(userDto.DodId);
            var currentUserDodId = GetCurrentUserId();

            if (userToUpdate == null)
                throw new ArgumentException("User account does not exist");

            var oldUser = new User(userToUpdate);

            _domainMapper.GetMapper<UserUpdateDTO, User>(userDto, userToUpdate).Map();
            if (currentUserDodId == userToUpdate.DodId) 
            {
                _userDomainService.UpdateUser(userToUpdate, oldUser);
            }
            else 
            {
                await _userDomainService.AdminUpdateUser(currentUserDodId, userToUpdate, oldUser);
            }

            await _userRepo.SaveAsync();
            return _autoMapper.Map<UserDTO>(userToUpdate);
        }

        public async Task<SearchResult<UserSearchDTO>> SearchUsers(SearchUserParams userParams)
        {
            var userSearchResults = await _userRepo.GetUsers(userParams.QueryString, userParams.PageNumber, userParams.PageSize);
            return new SearchResult<UserSearchDTO>(
                _autoMapper.Map<IEnumerable<UserSearchDTO>>(userSearchResults.Results),
                userSearchResults.TotalCount
            );
        }
    }
}