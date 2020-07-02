using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DefendX.API.AppLayer.Params;
using DefendX.API.DAL.Models.Pagination;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.SofaLicenseAggregate;
using DefendX.API.Domain.AggregatesModel.SofaLicensePrintQueueAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;

namespace DefendX.API.DSL {
    public class LicenseDomainService : TDomainService {
        private ILicenseRepository _licenseRepo;
        private IPrintQueueRepository _printQueueRepo;

        public LicenseDomainService (
            ILicenseRepository licenseRepo,
            IPrintQueueRepository printQueueRepo,
            IUserRepository userRepo
        ) :base(userRepo) {
            _licenseRepo = licenseRepo;
            _printQueueRepo = printQueueRepo;
        }

        public async Task<SofaLicense> GetLicense (int licenseId, long userId) {
            var license = await _licenseRepo.GetAsync(licenseId);
            if (license == null)
                throw new System.UnauthorizedAccessException("Unable process request");

            if(!await IsUserReadAuthorized(license, userId))
                throw new System.UnauthorizedAccessException("Unauthorized");

            return license;
        }

        public async Task<SearchResult<SofaLicense>> GetLicenses(SearchUserParams userParams, long userId)
        {
            SearchResult<SofaLicense> licenseResult;
            var user = await _userRepo.Get(userId);
            if (user.Account.AccountTypeId == (int)AccountTypes.Administrator)
            {
                licenseResult = await _licenseRepo.GetLicenses (userParams.QueryString, userParams.PageNumber, userParams.PageSize);
            }
            else
            {
                licenseResult = await _licenseRepo.GetLicenses (userParams.QueryString, userParams.PageNumber, userParams.PageSize, user.UnitId);
            }
            return licenseResult;
        }

        public async Task<SofaLicense> SaveLicense (SofaLicense sofaLicense, long userId) {
            if ((await _licenseRepo.GetFirstOrDefault (l => l.DodId == sofaLicense.DodId)) != null)
                throw new System.ArgumentException ("DoD ID already exists in database", string.Empty);

            sofaLicense.SetLastEditedById (userId);

            var user = await _userRepo.Get(userId);
            // Not Admin
            if(user.Account.AccountTypeId != (int)AccountTypes.Administrator)
            {
                // User
                if (user.Account.AccountTypeId == (int)AccountTypes.User)
                {
                    if(userId != sofaLicense.DodId) 
                    {
                        await SetLicenseSponsorAsUser(sofaLicense, userId);
                    }
                    else 
                    {
                        sofaLicense.SetSponsorId(null);
                    }
                }
                // CSS
                else if (user.Account.AccountTypeId == (int)AccountTypes.Css)
                {
                    if (sofaLicense.UnitId != user.UnitId)
                    {
                        throw new ApplicationException("License must be from same unit as user");
                    }
                }

                sofaLicense.SetRemarks(null);
                sofaLicense.SetIsAuthenticated(false);
                sofaLicense.SetPermitNumber (GeneratePermitNumber ());
            } 
            // Admin
            else
            {
                if (String.IsNullOrEmpty(sofaLicense.PermitNumber))
                {
                    sofaLicense.SetPermitNumber (GeneratePermitNumber ());
                } 
                else
                {
                    var indexOfDash = sofaLicense.PermitNumber.IndexOf("-");
                    int permitNumber;
                    Int32.TryParse(sofaLicense.PermitNumber.Substring(indexOfDash + 1), out permitNumber);
                    if (permitNumber == 0 || _licenseRepo.GetMaxPermitNumber() < permitNumber)
                        throw new System.ApplicationException("Invalid Permit Number");

                    if (await _licenseRepo.GetFirstOrDefault(l => String.Equals(l.PermitNumber, sofaLicense.PermitNumber)) != null)
                        throw new System.ArgumentException("Permit Number Already Exists", string.Empty);
                }
            }

            if (!sofaLicense.IsValid ())
                throw new System.ArgumentException ("Invalid License Data", string.Empty);

            await _licenseRepo.Insert (sofaLicense);
            await _licenseRepo.SaveAsync ();

            return sofaLicense;
        }

        public async Task<SearchResult<SofaLicense>> SearchLicenses(SearchUserParams userParams, long userId)
        {
            SearchResult<SofaLicense> licenseResults;
            var user = await _userRepo.Get(userId);
            if (user == null)
                throw new ArgumentException("Invalid User");

            // CSS
            if (user.Account.AccountTypeId == (int)AccountTypes.Css)
            {
                licenseResults = await _licenseRepo.GetLicenses (userParams.QueryString, userParams.PageNumber, userParams.PageSize, user.UnitId);
            }
            // Admin
            else
            {
                licenseResults = await _licenseRepo.GetLicenses (userParams.QueryString, userParams.PageNumber, userParams.PageSize);

            }
            return licenseResults;
        }

        public async Task<SofaLicense> UpdateLicense (SofaLicense sofaLicense, long userId, bool isLicenseAuthenticatedinDB = false) {
            if(!await IsUserWriteAuthorized(sofaLicense, userId, isLicenseAuthenticatedinDB))
                throw new System.UnauthorizedAccessException("Unable to process update");

            sofaLicense.SetLastEditedById (userId);
            sofaLicense.SetDateUpdated ();

            if (!sofaLicense.IsValid ())
                throw new System.ArgumentException ("Invalid License Data", string.Empty);

            await _licenseRepo.SaveAsync ();
            return sofaLicense;
        }

        public async Task DeleteLicense(SofaLicense license, long userId)
        {
            if (!(await IsUserWriteAuthorized(license, userId))) 
                throw new System.UnauthorizedAccessException("Unable to process request");

            _licenseRepo.Delete(license);
            await _licenseRepo.SaveAsync();
        }

        public async Task DeleteLicense(int[] ids, long userId)
        {
            List<Task> TaskList = new List<Task>();
            if(! await IsUserAdmin(userId))
                throw new System.UnauthorizedAccessException("Unable to process request");

            foreach(int id in ids)   {
                TaskList.Add(_licenseRepo.Delete(id));
            }
            Task.WaitAll(TaskList.ToArray());
            await _licenseRepo.SaveAsync();
        }

        public async Task<IEnumerable<SofaLicense>> GetUserLicenses(long userId)
        {
            var userLicense = await _licenseRepo.GetFirstOrDefault(l => l.DodId == userId);
            
            if(userLicense == null)
                return null;

            var licenseList = new List<SofaLicense>();
            licenseList.Add(userLicense);
            licenseList.AddRange(userLicense.Dependents);
            return licenseList;
        }

        public async Task AddToPrintQueue (int licenseId, long userId) {
            if(! await _licenseRepo.ContainsId(licenseId))
                throw new System.ArgumentException ("Invalid Argument", string.Empty);

            if(await _printQueueRepo.GetPrintQueueCount(userId) >= 120)
                throw new System.ApplicationException("Max number of licenses in print queue");

            var printQueueEntry = new PrintQueue (userId, licenseId);

            if (!printQueueEntry.IsValid ())
                throw new System.ArgumentException ("Invalid Argument", string.Empty);

            await _printQueueRepo.Insert (printQueueEntry);
            await _printQueueRepo.SaveAsync ();
        }

        public async Task AddToPrintQueue(int[] licenseIds, long userId) 
        {
            //TODO put all context saves in AppService layer to optimize.  This method just simply use "AddToPrintQueue(int, long)" method
            if(await _printQueueRepo.GetPrintQueueCount(userId) >= 120)
                throw new System.ApplicationException("Max number of licenses in print queue");

            foreach(int licenseId in licenseIds ) {
                if(!await _licenseRepo.ContainsId(licenseId))
                    throw new System.ArgumentException ("Invalid Argument", string.Empty);

                var printQueueEntry = new PrintQueue(userId, licenseId);
                if(!printQueueEntry.IsValid())
                    throw new System.ArgumentException ("Invalid Argument", string.Empty);
                
                await _printQueueRepo.Insert(printQueueEntry);
            }

            await _printQueueRepo.SaveAsync ();
        }

        public async Task IssueLicense(int licenseId, long currentUserId)
        {
            var license = await _licenseRepo.GetAsync(licenseId);

            if (license == null)
                return;
            
            license.AddIssue(new SofaLicenseIssue(currentUserId));
        }

        private string GeneratePermitNumber () {
            var MaxPermit = _licenseRepo.GetMaxPermitNumber ();
            if (MaxPermit == 0)
                MaxPermit = 168001;

            return "1-" + (++MaxPermit).ToString ();
        }

        private async Task SetLicenseSponsorAsUser(SofaLicense license, long sponsorDodId) {
            var sponsorLicense = await _licenseRepo.GetFirstOrDefault(l => l.DodId == sponsorDodId);

            //TODO Adding person to database would eliminate the need to add sponsor license first
            if(sponsorLicense == null) 
                throw new System.ArgumentException ("Please add sponsor license first", string.Empty);

            if(sponsorLicense.Dependents?.Count >= 14)
                throw new ApplicationException("Max number of licenses added");
        
            license.SetSponsorId(sponsorLicense.Id);
        }

        private async Task<bool> IsUserReadAuthorized(SofaLicense license, long userId) 
        {
            // Self or dependent
            if((license.Sponsor != null && license.Sponsor.DodId == userId) || license.DodId == userId)
                return true;

            // Admin
            var user = await _userRepo.Get(userId);
            if(user.Account.AccountTypeId == (int)AccountTypes.Administrator)
                return true;

            // CSS
            if(user.Account.AccountTypeId == (int)AccountTypes.Css)
            {
                if (license.UnitId == user.UnitId)
                {
                    return true;
                }
            }

            return false;
        }

        private async Task<bool> IsUserWriteAuthorized(SofaLicense license, long userId, bool isLicenseAuthenticatedinDB = false) 
        {
            // Admin
            var user = await _userRepo.Get(userId);
            if(user.Account.AccountTypeId == (int)AccountTypes.Administrator)
                return true;
            
            // License is Admin Authenticated
            if (isLicenseAuthenticatedinDB || license.IsAuthenticated)
                return false;

            // Only Admins write remarks
            license.SetRemarks(null); //TODO out of responsibility of method

            // CSS
            if(user.Account.AccountTypeId == (int)AccountTypes.Css)
            {
                if (license.UnitId == user.UnitId)
                {
                    return true;
                }
            }

            // Self or Dependent
            if((license.Sponsor != null && license.Sponsor.DodId == userId) || license.DodId == userId)
                return true;

            return false;
        }

    }
}