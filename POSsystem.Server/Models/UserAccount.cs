namespace POSsystem.Server.Models;

public sealed class UserAccount
{
    public int AccountId { get; init; }

    public string UserName { get; init; } = string.Empty;

    public int UserRoleId { get; init; }

    public string UserRole { get; init; } = string.Empty;

    public IReadOnlyList<int> AuthorizedFeatureIds { get; init; } = Array.Empty<int>();
}
