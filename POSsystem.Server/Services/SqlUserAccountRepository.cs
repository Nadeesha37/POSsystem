using System.Data;
using Microsoft.Data.SqlClient;
using POSsystem.Server.Models;

namespace POSsystem.Server.Services;

public sealed class SqlUserAccountRepository(
    IConfiguration configuration,
    ILogger<SqlUserAccountRepository> logger) : IUserAccountRepository
{
    private const string DefaultConnectionStringName = "DefaultConnection";
    private const string DefaultStoredProcedure = "dbo.AuthenticateUser";

    public async Task<UserAccount?> AuthenticateAsync(
        string userName,
        string password,
        CancellationToken cancellationToken)
    {
        /*var connectionString = configuration.GetConnectionString(DefaultConnectionStringName);
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                $"Connection string '{DefaultConnectionStringName}' is not configured.");
        }

        var storedProcedure = configuration["Authentication:StoredProcedure"];
        if (string.IsNullOrWhiteSpace(storedProcedure))
        {
            storedProcedure = DefaultStoredProcedure;
        }*/
        // Data base operation hold for now.

        try
        {
            /*await using var connection = new SqlConnection(connectionString);
            await using var command = new SqlCommand(storedProcedure, connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add("@UserName", SqlDbType.NVarChar, 256).Value = userName;
            command.Parameters.Add("@Password", SqlDbType.NVarChar, 512).Value = password;

            await connection.OpenAsync(cancellationToken);
            await using var reader = await command.ExecuteReaderAsync(cancellationToken);

            if (!await reader.ReadAsync(cancellationToken))
            {
                return null;
            }

            var accountIdOrdinal = GetRequiredOrdinal(reader, "AccountId");
            var userNameOrdinal = GetRequiredOrdinal(reader, "UserName");
            var userRoleIdOrdinal = GetRequiredOrdinal(reader, "UserRoleId");
            var userRoleOrdinal = GetRequiredOrdinal(reader, "UserRole");
            var featureIdOrdinal = GetOptionalOrdinal(reader, "FeatureId");
            var featureIds = new HashSet<int>();

            var account = ReadAccount(reader, accountIdOrdinal, userNameOrdinal, userRoleIdOrdinal, userRoleOrdinal);
            AddFeatureId(reader, featureIdOrdinal, featureIds);

            while (await reader.ReadAsync(cancellationToken))
            {
                AddFeatureId(reader, featureIdOrdinal, featureIds);
            } 

            return new UserAccount
            {
                AccountId = account.AccountId,
                UserName = account.UserName,
                UserRoleId = account.UserRoleId,
                UserRole = account.UserRole,
                AuthorizedFeatureIds = featureIds.Order().ToArray()
            };
            */
            // Disabled database operation for now, returning a mock user account for testing purposes.

            
            // Added mock user account with some authorized feature IDs
            return new UserAccount
            {
                AccountId = 1001,
                UserName = "testuser",
                UserRoleId = 1,
                UserRole = "User",
                AuthorizedFeatureIds = new int[] { 1, 2, 3 }
            };
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception exception) when (exception is SqlException or InvalidOperationException)
        {
            logger.LogError(exception, "Authentication stored procedure execution failed.");
            throw new AuthenticationDataAccessException(exception);
        }
    }

    private static UserAccount ReadAccount(
        SqlDataReader reader,
        int accountIdOrdinal,
        int userNameOrdinal,
        int userRoleIdOrdinal,
        int userRoleOrdinal)
    {
        return new UserAccount
        {
            AccountId = reader.GetInt32(accountIdOrdinal),
            UserName = reader.GetString(userNameOrdinal),
            UserRoleId = reader.GetInt32(userRoleIdOrdinal),
            UserRole = reader.GetString(userRoleOrdinal)
        };
    }

    private static void AddFeatureId(SqlDataReader reader, int featureIdOrdinal, ISet<int> featureIds)
    {
        if (featureIdOrdinal >= 0 && !reader.IsDBNull(featureIdOrdinal))
        {
            featureIds.Add(reader.GetInt32(featureIdOrdinal));
        }
    }

    private static int GetRequiredOrdinal(SqlDataReader reader, string columnName)
    {
        var ordinal = GetOptionalOrdinal(reader, columnName);
        return ordinal >= 0
            ? ordinal
            : throw new InvalidOperationException($"Stored procedure result is missing '{columnName}'.");
    }

    private static int GetOptionalOrdinal(SqlDataReader reader, string columnName)
    {
        for (var index = 0; index < reader.FieldCount; index++)
        {
            if (string.Equals(reader.GetName(index), columnName, StringComparison.OrdinalIgnoreCase))
            {
                return index;
            }
        }

        return -1;
    }
}
