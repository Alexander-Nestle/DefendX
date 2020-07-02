using System.Collections.Generic;
using System.Threading.Tasks;
using DefendX.API.AppLayer.Params;
using DefendX.API.AppLayer.DTOs;
using DefendX.API.Domain.AggregatesModel;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.ServiceAggregate;
using DefendX.API.Domain.AggregatesModel.UnitsAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using System;

namespace DefendX.API.AppLayer.Services {
    public class AppDataAppService : TAppService {
        private IGenericRepository<Service> _serviceRepo;
        private IUnitRepository _unitRepo;
        private IGenericRepository<AccountType> _accountRepo;
        private IMapper _mapper;
        public AppDataAppService (
            IHttpContextAccessor accessor,
            IUserRepository userRepo,
            IGenericRepository<Service> serviceRepo,
            IUnitRepository unitRepo,
            IGenericRepository<AccountType> accountRepo,
            IMapper mapper
        ) : base (accessor, userRepo) {
            _serviceRepo = serviceRepo;
            _unitRepo = unitRepo;
            _accountRepo = accountRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Service>> GetServices () => await _serviceRepo.GetAsync ();

        public async Task<IEnumerable<Rank>> GetRanks (int serviceId) 
        {
            return (await _serviceRepo.GetAsync (serviceId)).Ranks;
        }

        public async Task<IEnumerable<Unit>> GetUnits (UnitUserParams unitUserParams)
        {
            return (await _unitRepo.GetUnits(unitUserParams));
        }

        public async Task<IEnumerable<AccountType>> GetAccountTypes() => await _accountRepo.GetAsync();

        public async Task<Faq> SaveNewFaq (FaqDTO faq) {
            var accountType = await _accountRepo.GetAsync(faq.AccountTypeId);

            var newFaq = _mapper.Map<Faq>(faq);

            accountType.AddFaq(newFaq);
            await _accountRepo.SaveAsync();

            return (newFaq);
        }

        public async Task<Faq> UpdateFaq (FaqDTO faq) {
            var accountType = await _accountRepo.GetAsync(faq.AccountTypeId);
            
            var updatedFaq = _mapper.Map<Faq>(faq);

            accountType.UpdateFaq(updatedFaq);
            await _accountRepo.SaveAsync();

            return updatedFaq;
        }

        public async Task DeleteFaq (FaqDTO faq) {
            var deleteFaq = _mapper.Map<Faq>(faq);

            var accountType = await _accountRepo.GetAsync(deleteFaq.AccountTypeId);
            
            accountType.RemoveFaq(deleteFaq);
            await _accountRepo.SaveAsync();
        }
    }
}