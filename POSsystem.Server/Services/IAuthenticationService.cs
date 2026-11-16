using POSsystem.Server.Models;

namespace POSsystem.Server.Services;

public interface IAuthenticationService
{
    Task<UserAccount?> AuthenticateAsync(LoginRequest request, CancellationToken cancellationToken);
}
