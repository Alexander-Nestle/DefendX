using System.Threading.Tasks;
using DefendX.API.Domain.AggregatesModel.AccountTypeAggregate;
using DefendX.API.Domain.AggregatesModel.UserAggregate;

namespace DefendX.API.DSL
{
    public class UserDomainService : TDomainService
    {
        public UserDomainService (
            IUserRepository userRepo
         ): base(userRepo) {}

        public async Task<User> GetUser (long currentUserId, long userId) {
            if (!(await IsUserAdmin(currentUserId)) && (currentUserId != userId) )
                throw new System.UnauthorizedAccessException("Unauthorized");

            var user = await _userRepo.GetAsync(userId);
            if (user == null)
                throw new System.UnauthorizedAccessException("Unable process request");

            return user;
        }

        /// <summary>
        /// This method updates a user account
        /// </summary>
        /// <remarks>
        /// This method is intended for updating the user's own account.  
        /// Please use AdminUpdateUser() for updating other user account
        /// </remarks>
        /// <returns>
        /// Updated User object
        /// </returns>
        /// <param name="newUser">User object containing updates</param>
        /// <param name="oldUser">User object containing values prior to update</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when unathorized changes are attempted.</exception>
        /// <exception cref="System.ArgumentException">Thrown when user updates are invalid.</exception>
        public User UpdateUser (User newUser, User oldUser) {
            var isAdmin = oldUser.Account.AccountTypeId == (int)AccountTypes.Administrator;
            if (newUser.AccountId != oldUser.AccountId ||
                (
                    !isAdmin && 
                    (newUser.UnitId != oldUser.UnitId || 
                    newUser.Account.AccountTypeId != oldUser.Account.AccountTypeId ||
                    (!string.IsNullOrEmpty(newUser.SignatureData) && string.IsNullOrEmpty(oldUser.SignatureData)))
                ))
                throw new System.UnauthorizedAccessException("Unauthorized");

             if (!newUser.IsValid())
                throw new System.ArgumentException("Unable to update user", "Invalid Argument");

            return newUser;
        }

        /// <summary>
        /// This method updates a user account
        /// </summary>
        /// <remarks>
        /// This method is intended for Administator updates to user accounts.
        /// Please use UpdateUser() for general user updates.
        /// </remarks>
        /// <returns>
        /// Updated User object
        /// </returns>
        /// <param name="currentUserId">Id of current user</param>
        /// <param name="newUser">User object containing updates</param>
        /// <param name="oldUser">User object containing values prior to update</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when unathorized changes are attempted.</exception>
        /// <exception cref="System.ArgumentException">Thrown when user updates are invalid.</exception>
        public async Task<User> AdminUpdateUser (long currentUserId, User newUser, User oldUser) {
            var isAdmin = await IsUserAdmin(currentUserId);
            if (newUser.AccountId != oldUser.AccountId || !isAdmin)
                throw new System.UnauthorizedAccessException("Unauthorized");

             if (!newUser.IsValid())
                throw new System.ArgumentException("Invalid Argument", "Unable to update user");
            return newUser;
        }
    }
}