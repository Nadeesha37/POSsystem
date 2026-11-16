using POSsystem.Server.Models;

namespace POSsystem.Server.Services;

public interface IUserAccountRepository
{
    Task<UserAccount?> AuthenticateAsync(string userName, string password, CancellationToken cancellationToken);
}
