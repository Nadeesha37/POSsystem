using POSsystem.Server.Models;

namespace POSsystem.Server.Services;

public sealed class AuthenticationService(IUserAccountRepository userAccountRepository) : IAuthenticationService
{
    public Task<UserAccount?> AuthenticateAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);

        return userAccountRepository.AuthenticateAsync(
            request.UserName.Trim(),
            request.Password,
            cancellationToken);
    }
}
