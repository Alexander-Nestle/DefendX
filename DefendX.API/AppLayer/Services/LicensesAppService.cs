using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using AutoMapper;
using DefendX.API.AppLayer.DTOs;
using DefendX.API.AppLayer.Params;
using DefendX.API.DAL.Models.Pagination;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate;
using DefendX.API.Domain.AggregatesModel.SofaLicensePrintQueueAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;
using DefendX.API.Domain.AggregatesModel.ValueObjects;
using DefendX.API.DSL;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace DefendX.API.AppLayer.Services {
    public class LicensesAppService : TAppService {
        private ILicenseRepository _licenseRepo;
        private IPrintQueueRepository _printQueueRepo;
        private IMapper _mapper;
        private LicenseDomainService _licenseDomainService;

        public LicensesAppService (
            IHttpContextAccessor accessor,
            IUserRepository userRepo,
            ILicenseRepository licenseRepo,
            IPrintQueueRepository printQueueRepo,
            IMapper mapper,
            LicenseDomainService licenseDomainService) : base (accessor, userRepo) {
            _licenseRepo = licenseRepo;
            _printQueueRepo = printQueueRepo;
            _mapper = mapper;
            _licenseDomainService = licenseDomainService;
        }

        public async Task<IEnumerable<SofaLicense>> GetLicenses () {
            return await _licenseRepo.GetAsync ();
        }

        public async Task<LicenseDTO> GetLicense (int id) {
            return _mapper.Map<LicenseDTO> (await _licenseDomainService.GetLicense (id, GetCurrentUserId ()));
        }

        public async Task<LicenseDTO> SaveLicense (LicenseDTO licenseDto) {
            if (licenseDto.SponsorDodId != null) {
                await SetSponsorId (licenseDto);
            }

            var sofaLicense = _mapper.Map<SofaLicense> (licenseDto);
            await _licenseDomainService.SaveLicense (sofaLicense, GetCurrentUserId ());
            _licenseRepo.LoadObjectProperties (sofaLicense);
            return _mapper.Map<LicenseDTO> (sofaLicense);
        }

        public async Task<LicenseDTO> UpdateLicense (LicenseDTO licenseDto) {
            var license = await _licenseRepo.GetAsync (licenseDto.Id);

            if (license == null)
                throw new ArgumentException ("Unable to update license", string.Empty);

            // Validates updated Sponsor
            if (
                (license.Sponsor == null && licenseDto.SponsorDodId != null) ||
                (license?.Sponsor?.DodId != licenseDto?.SponsorDodId)
            ) {
                await SetSponsorId (licenseDto);
            }

            var isLicenseAuthenticatedinDB = license.IsAuthenticated;

            _mapper.Map (licenseDto, license, opt => opt.ConfigureMap ().ForMember (dest => dest.PermitNumber, m => m.Ignore ()));
            return _mapper.Map<LicenseDTO> (
                await _licenseDomainService.UpdateLicense (
                    license,
                    GetCurrentUserId (),
                    isLicenseAuthenticatedinDB)
            );
        }

        public async Task<SearchResult<LicenseSearchDTO>> SearchLicenses (SearchUserParams userParams) {
            var licenseResult = await _licenseDomainService.SearchLicenses(userParams, GetCurrentUserId());
            return new SearchResult<LicenseSearchDTO> (
                _mapper.Map<IEnumerable<LicenseSearchDTO>> (licenseResult.Results),
                licenseResult.TotalCount);
        }

        public async Task DeleteLicense (int id) {
            var license = await _licenseRepo.GetAsync (id);

            if (license == null)
                throw new ArgumentException ("License not found");

            await _licenseDomainService.DeleteLicense (license, GetCurrentUserId ());
            
        }

        public async Task DeleteLicense (int[] ids) {
            foreach (int id in ids) {
                if (!(await _licenseRepo.ContainsId (id)))
                    throw new System.ArgumentException ("Delete Failed");
            }
            await _licenseDomainService.DeleteLicense (ids, GetCurrentUserId ());
        }

        public async Task<SearchResult<LicenseSearchDTO>> GetUserLicensesForDisplay () {
            var userLicenses = _mapper.Map<IEnumerable<LicenseSearchDTO>> (
                await _licenseDomainService.GetUserLicenses (GetCurrentUserId ())
            );

            if (userLicenses == null) {
                return new SearchResult<LicenseSearchDTO> (
                    new List<LicenseSearchDTO> (),
                    0
                );
            }

            return new SearchResult<LicenseSearchDTO> (
                userLicenses,
                (userLicenses as ICollection<LicenseSearchDTO>).Count
            );
        }

        public async Task<Tuple<List<int>, List<LicenseDTO>> > GetLicensePrintQueue () {
            var printQueueEntries = await _printQueueRepo.GetPrintQueue (GetCurrentUserId ());
            List<int> licenseIds = new List<int> ();
            List<LicenseDTO> licenses = new List<LicenseDTO> ();

            foreach (var entry in printQueueEntries) {
                licenseIds.Add (entry.LicenseId);
                licenses.Add (_mapper.Map<LicenseDTO> (entry.license));
            }
            return new Tuple<List<int>, List<LicenseDTO>> (licenseIds, licenses);
        }

        public async Task AddToPrintQueue (int licenseId) {
            await _licenseDomainService.AddToPrintQueue (licenseId, GetCurrentUserId ());
        }

        public async Task AddToPrintQueue (int[] licenseIds) {
            await _licenseDomainService.AddToPrintQueue (licenseIds, GetCurrentUserId ());
        }

        public async Task RemoveFromPrintQueue (int licenseId) {
            _printQueueRepo.Delete (licenseId, GetCurrentUserId ());
            await _printQueueRepo.SaveAsync ();
        }

        public async Task RemoveAllFromPrintQueue () {
            _printQueueRepo.Delete (GetCurrentUserId ());
            await _printQueueRepo.SaveAsync ();
        }

        public async Task IssueLicense(int licenseId)
        {
            await _licenseDomainService.IssueLicense(licenseId, GetCurrentUserId());
            await _licenseRepo.SaveAsync();
        }

        public async Task IssueLicenses(int[] licenseIds)
        {
            var currentUserId = GetCurrentUserId();
            foreach(int licenseId in licenseIds)
            {
                await _licenseDomainService.IssueLicense(licenseId, currentUserId);
            }
            await _licenseRepo.SaveAsync();
        }

        private async Task SetSponsorId (LicenseDTO license) {
            if (license.SponsorDodId == null)
            {
                license.SponsorId = null;
                return;
            }

            var sponsor = await _licenseRepo.GetFirstOrDefault (l => l.DodId == license.SponsorDodId);
            if (sponsor == null)
            {
                throw new System.ArgumentException ("Sponsor license not found");
            }
            else if (sponsor.UnitId != license.UnitId)
            {
                throw new System.ApplicationException("Dependent must be from same unit as sponsor");
            }

            license.SponsorId = sponsor.Id;
        }
    }
}